import Panzoom, {
	type PanzoomGlobalOptions,
	type PanzoomObject,
} from '@panzoom/panzoom'

import {
	PAN_ZOOM_VIEWER_CONTENT_READY_EVENT,
	type PanZoomViewerContentReadyDetail,
	type PanZoomViewerTransformTarget,
} from './constant'

const TAG_NAME = 'pan-zoom-viewer'
const EXCLUDE_CLASS = 'panzoom-exclude'
const DEFAULT_MIN_SCALE = 0.25
const DEFAULT_MAX_SCALE = 6
const DEFAULT_STEP = 0.2

class PanZoomViewer extends HTMLElement {
	static observedAttributes = ['min-scale', 'max-scale', 'step']

	private readonly shadow: ShadowRoot
	private viewport: HTMLDivElement | null = null
	private canvas: HTMLDivElement | null = null
	private scene: HTMLDivElement | null = null
	private slotElement: HTMLSlotElement | null = null
	private fullscreenButton: HTMLButtonElement | null = null
	private panzoom: PanzoomObject | null = null
	private resizeObserver: ResizeObserver | null = null
	private lifecycleAbortController: AbortController | null = null
	private interactionAbortController: AbortController | null = null
	private fitFrame: number | null = null
	private contentSource: Element | null = null
	private contentTarget: PanZoomViewerTransformTarget | null = null
	private activeTarget: PanZoomViewerTransformTarget | null = null

	constructor() {
		super()
		this.shadow = this.attachShadow({ mode: 'open' })
	}

	connectedCallback(): void {
		if (!this.viewport) {
			this.render()
		}

		this.bindEvents()
		this.refreshPanzoomTarget()
		this.updateFullscreenButtonState()
		this.scheduleFit()
	}

	attributeChangedCallback(
		_name: string,
		oldValue: string | null,
		newValue: string | null
	): void {
		if (oldValue === newValue) {
			return
		}

		if (this.panzoom && this.activeTarget) {
			this.panzoom.setOptions(this.getPanzoomOptions(this.activeTarget))
		}

		this.scheduleFit()
	}

	disconnectedCallback(): void {
		this.stopObservers()
		this.lifecycleAbortController?.abort()
		this.lifecycleAbortController = null
		this.destroyPanzoom()

		if (this.fitFrame !== null) {
			cancelAnimationFrame(this.fitFrame)
			this.fitFrame = null
		}
	}

	private render(): void {
		this.shadow.innerHTML = `
			<style>
				:host {
					display: block;
					width: 100%;
					height: var(--pan-zoom-viewer-height, 480px);
					margin: 1.5rem 0;
				}

				* {
					box-sizing: border-box;
				}

				.viewer,
				.viewport,
				.canvas {
					width: 100%;
					height: 100%;
				}

				.viewer {
					position: relative;
				}

				.viewport {
					position: relative;
					overflow: hidden;
					border-radius: 18px;
					border: 1px solid rgba(74, 144, 226, 0.2);
					background:
						linear-gradient(rgba(74, 144, 226, 0.08) 1px, transparent 1px),
						linear-gradient(90deg, rgba(74, 144, 226, 0.08) 1px, transparent 1px),
						radial-gradient(circle at top left, rgba(78, 205, 196, 0.2), transparent 32%),
						linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%);
					background-size: 24px 24px, 24px 24px, auto, auto;
					box-shadow: 0 12px 24px rgba(26, 26, 26, 0.08);
				}

				:host-context(.dark) .viewport {
					border-color: rgba(122, 184, 255, 0.28);
					background:
						linear-gradient(rgba(122, 184, 255, 0.08) 1px, transparent 1px),
						linear-gradient(90deg, rgba(122, 184, 255, 0.08) 1px, transparent 1px),
						radial-gradient(circle at top left, rgba(78, 205, 196, 0.22), transparent 32%),
						linear-gradient(180deg, #262c38 0%, #1f2430 100%);
					box-shadow: 0 16px 30px rgba(0, 0, 0, 0.25);
				}

				.viewport:fullscreen {
					border-radius: 0;
				}

				.canvas {
					position: relative;
					overflow: hidden;
					touch-action: none;
					cursor: grab;
				}

				.canvas.is-panning {
					cursor: grabbing;
				}

				.scene {
					position: absolute;
					top: 0;
					left: 0;
					display: inline-block;
					width: max-content;
					height: max-content;
					max-width: none;
					max-height: none;
					transform-origin: 50% 50%;
				}

				slot {
					display: block;
				}

				::slotted(mermaid-viewer),
				::slotted(svg),
				::slotted(canvas),
				::slotted(img),
				::slotted(video) {
					display: block;
					max-width: none !important;
				}

				.fullscreen-button {
					position: absolute;
					top: 12px;
					right: 12px;
					z-index: 2;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					width: 40px;
					height: 40px;
					border: 1px solid rgba(74, 144, 226, 0.25);
					border-radius: 999px;
					background: rgba(255, 255, 255, 0.88);
					backdrop-filter: blur(10px);
					box-shadow: 0 8px 18px rgba(26, 26, 26, 0.12);
					cursor: pointer;
					font-size: 18px;
					line-height: 1;
					transition:
						transform 160ms ease,
						box-shadow 160ms ease,
						opacity 160ms ease;
				}

				.fullscreen-button:hover {
					transform: translateY(-1px) scale(1.04);
					box-shadow: 0 10px 22px rgba(26, 26, 26, 0.16);
				}

				.fullscreen-button:focus-visible {
					outline: 2px solid #4a90e2;
					outline-offset: 2px;
				}

				:host-context(.dark) .fullscreen-button {
					border-color: rgba(122, 184, 255, 0.24);
					background: rgba(31, 36, 48, 0.88);
					box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
				}

				@media (max-width: 768px) {
					:host {
						height: var(--pan-zoom-viewer-height, 360px);
					}

					.fullscreen-button {
						width: 36px;
						height: 36px;
						font-size: 16px;
					}
				}
			</style>
			<div class="viewer">
				<div class="viewport">
					<button
						type="button"
						class="fullscreen-button ${EXCLUDE_CLASS}"
						aria-label="进入全屏"
						title="进入全屏"
					>
						🔍
					</button>
					<div class="canvas">
						<div class="scene">
							<slot></slot>
						</div>
					</div>
				</div>
			</div>
		`

		this.viewport = this.shadow.querySelector('.viewport')
		this.canvas = this.shadow.querySelector('.canvas')
		this.scene = this.shadow.querySelector('.scene')
		this.slotElement = this.shadow.querySelector('slot')
		this.fullscreenButton = this.shadow.querySelector('.fullscreen-button')
	}

	private bindEvents(): void {
		this.lifecycleAbortController?.abort()
		this.lifecycleAbortController = new AbortController()

		const signal = this.lifecycleAbortController.signal

		this.fullscreenButton?.addEventListener(
			'click',
			() => {
				void this.toggleFullscreen().catch(() => {
					this.updateFullscreenButtonState()
				})
			},
			{ signal }
		)

		this.slotElement?.addEventListener(
			'slotchange',
			() => {
				this.handleSlotChange()
			},
			{ signal }
		)

		this.addEventListener(
			PAN_ZOOM_VIEWER_CONTENT_READY_EVENT,
			(event) => {
				this.handleContentReadyEvent(
					event as CustomEvent<PanZoomViewerContentReadyDetail>
				)
			},
			{ signal }
		)

		document.addEventListener(
			'fullscreenchange',
			() => {
				this.updateFullscreenButtonState()
				this.scheduleFit()
			},
			{ signal }
		)

		window.addEventListener(
			'blur',
			() => {
				this.canvas?.classList.remove('is-panning')
			},
			{ signal }
		)
	}

	private handleSlotChange(): void {
		if (
			(this.contentSource && !this.isOwnedContent(this.contentSource)) ||
			(this.contentTarget && !this.contentTarget.isConnected)
		) {
			this.contentSource = null
			this.contentTarget = null
		}

		this.refreshPanzoomTarget()
	}

	private handleContentReadyEvent(
		event: CustomEvent<PanZoomViewerContentReadyDetail>
	): void {
		const source = event.target instanceof Element ? event.target : null
		if (!source || source.closest(TAG_NAME) !== this) {
			return
		}

		const nextTarget = event.detail?.target
		if (!(nextTarget instanceof Element) || !nextTarget.isConnected) {
			return
		}

		this.contentSource = source
		this.contentTarget = nextTarget
		event.stopPropagation()
		this.refreshPanzoomTarget()
	}

	private refreshPanzoomTarget(): void {
		const nextTarget = this.resolvePanzoomTarget()
		if (!nextTarget) {
			return
		}

		if (this.panzoom && this.activeTarget === nextTarget) {
			this.panzoom.setOptions(this.getPanzoomOptions(nextTarget))
			this.bindInteractionEvents()
			this.startObservers()
			this.scheduleFit()
			return
		}

		this.destroyPanzoom()
		this.activeTarget = nextTarget
		this.panzoom = Panzoom(nextTarget, this.getPanzoomOptions(nextTarget))
		this.bindInteractionEvents()
		this.startObservers()
		this.scheduleFit()
	}

	private resolvePanzoomTarget(): PanZoomViewerTransformTarget | null {
		if (
			this.contentTarget &&
			this.contentSource &&
			this.contentTarget.isConnected &&
			this.isOwnedContent(this.contentSource)
		) {
			return this.contentTarget
		}

		this.contentSource = null
		this.contentTarget = null

		const directSvg = this.slotElement
			?.assignedElements({ flatten: true })
			.find(
				(element): element is SVGSVGElement => element instanceof SVGSVGElement
			)

		return directSvg ?? this.scene
	}

	private isOwnedContent(source: Element): boolean {
		return source.isConnected && source.closest(TAG_NAME) === this
	}

	private bindInteractionEvents(): void {
		this.interactionAbortController?.abort()
		this.interactionAbortController = null

		if (!this.panzoom || !this.canvas) {
			return
		}

		this.interactionAbortController = new AbortController()
		const signal = this.interactionAbortController.signal
		const { down, move, up } = this.panzoom.eventNames

		for (const eventName of down.split(' ')) {
			this.canvas.addEventListener(eventName, this.handlePanzoomDown, {
				passive: false,
				signal,
			})
		}

		for (const eventName of move.split(' ')) {
			document.addEventListener(eventName, this.handlePanzoomMove, {
				passive: false,
				signal,
			})
		}

		for (const eventName of up.split(' ')) {
			document.addEventListener(eventName, this.handlePanzoomUp, {
				passive: false,
				signal,
			})
		}

		this.canvas.addEventListener('wheel', this.handleWheel, {
			passive: false,
			signal,
		})
	}

	private handlePanzoomDown = (event: Event): void => {
		if (!this.panzoom) {
			return
		}

		this.canvas?.classList.add('is-panning')
		this.panzoom.handleDown(event as PointerEvent)
	}

	private handlePanzoomMove = (event: Event): void => {
		this.panzoom?.handleMove(event as PointerEvent)
	}

	private handlePanzoomUp = (event: Event): void => {
		this.canvas?.classList.remove('is-panning')
		this.panzoom?.handleUp(event as PointerEvent)
	}

	private handleWheel = (event: WheelEvent): void => {
		if (!this.panzoom) {
			return
		}

		event.preventDefault()
		this.panzoom.zoomWithWheel(event)
	}

	private destroyPanzoom(): void {
		this.interactionAbortController?.abort()
		this.interactionAbortController = null
		this.canvas?.classList.remove('is-panning')
		this.panzoom?.destroy()
		this.panzoom = null
		this.activeTarget = null
	}

	private startObservers(): void {
		if (!this.viewport || !this.activeTarget) {
			return
		}

		this.resizeObserver?.disconnect()
		this.resizeObserver = new ResizeObserver(() => {
			this.scheduleFit()
		})

		this.observeResizeTarget(this.viewport)
		this.observeResizeTarget(this.activeTarget)
	}

	private observeResizeTarget(target: Element): void {
		try {
			this.resizeObserver?.observe(target)
		} catch {
			return
		}
	}

	private stopObservers(): void {
		this.resizeObserver?.disconnect()
		this.resizeObserver = null
	}

	private getPanzoomOptions(
		target: PanZoomViewerTransformTarget
	): PanzoomGlobalOptions {
		return {
			animate: false,
			cursor: 'grab',
			excludeClass: EXCLUDE_CLASS,
			maxScale: this.maxScale,
			minScale: this.minScale,
			noBind: true,
			overflow: target === this.scene ? 'hidden' : 'visible',
			step: this.step,
			touchAction: 'none',
		}
	}

	private get minScale(): number {
		return this.getNumberAttribute('min-scale', DEFAULT_MIN_SCALE)
	}

	private get maxScale(): number {
		return Math.max(
			this.minScale,
			this.getNumberAttribute('max-scale', DEFAULT_MAX_SCALE)
		)
	}

	private get step(): number {
		return Math.max(0.01, this.getNumberAttribute('step', DEFAULT_STEP))
	}

	private getNumberAttribute(name: string, fallback: number): number {
		const value = this.getAttribute(name)
		if (!value) {
			return fallback
		}

		const parsed = Number(value)
		return Number.isFinite(parsed) ? parsed : fallback
	}

	private scheduleFit(): void {
		if (this.fitFrame !== null) {
			cancelAnimationFrame(this.fitFrame)
		}

		this.fitFrame = requestAnimationFrame(() => {
			this.fitFrame = requestAnimationFrame(() => {
				this.fitFrame = null
				this.fitToView()
			})
		})
	}

	private fitToView(): void {
		if (!this.panzoom || !this.viewport || !this.activeTarget) {
			return
		}

		const viewportWidth = this.viewport.clientWidth
		const viewportHeight = this.viewport.clientHeight
		if (!viewportWidth || !viewportHeight) {
			return
		}

		this.panzoom.pan(0, 0, { animate: false, force: true })
		this.panzoom.zoom(1, { animate: false, force: true })

		requestAnimationFrame(() => {
			const targetRect = this.getTargetRect()
			if (!this.panzoom || !targetRect) {
				return
			}

			const fitScale = Math.min(
				this.maxScale,
				Math.max(
					this.minScale,
					Math.min(
						viewportWidth / targetRect.width,
						viewportHeight / targetRect.height
					)
				)
			)

			this.panzoom.zoom(fitScale, { animate: false, force: true })

			requestAnimationFrame(() => {
				this.centerTarget()
			})
		})
	}

	private getTargetRect(): DOMRect | null {
		if (!this.activeTarget) {
			return null
		}

		const rect = this.activeTarget.getBoundingClientRect()
		if (!rect.width || !rect.height) {
			return null
		}

		return rect
	}

	private centerTarget(): void {
		if (!this.panzoom || !this.viewport || !this.activeTarget) {
			return
		}

		const viewportRect = this.viewport.getBoundingClientRect()
		const targetRect = this.getTargetRect()
		const scale = this.panzoom.getScale()

		if (!targetRect || !scale) {
			return
		}

		const deltaX =
			viewportRect.left +
			(viewportRect.width - targetRect.width) / 2 -
			targetRect.left
		const deltaY =
			viewportRect.top +
			(viewportRect.height - targetRect.height) / 2 -
			targetRect.top
		const currentPan = this.panzoom.getPan()

		this.panzoom.pan(
			currentPan.x + deltaX / scale,
			currentPan.y + deltaY / scale,
			{
				animate: false,
				force: true,
			}
		)
	}

	private async toggleFullscreen(): Promise<void> {
		if (!this.viewport) {
			return
		}

		if (document.fullscreenElement === this.viewport) {
			await document.exitFullscreen()
			return
		}

		await this.viewport.requestFullscreen()
	}

	private updateFullscreenButtonState(): void {
		if (!this.fullscreenButton || !this.viewport) {
			return
		}

		const isFullscreen = document.fullscreenElement === this.viewport
		const label = isFullscreen ? '退出全屏' : '进入全屏'

		this.fullscreenButton.setAttribute('aria-label', label)
		this.fullscreenButton.setAttribute('title', label)
	}
}

if (!customElements.get(TAG_NAME)) {
	customElements.define(TAG_NAME, PanZoomViewer)
}

export default PanZoomViewer

declare global {
	interface HTMLElementTagNameMap {
		'pan-zoom-viewer': PanZoomViewer
	}
}
