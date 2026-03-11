import type { MermaidConfig } from 'mermaid'

import {
	dispatchPanZoomViewerContentReady,
	PAN_ZOOM_VIEWER_HEIGHT_VAR,
	PAN_ZOOM_VIEWER_WIDTH_VAR,
} from './constant'

// 应该懒加载
class MermaidViewer extends HTMLElement {
	private _rendered: boolean = false

	constructor() {
		super()
	}

	async connectedCallback() {
		if (this._rendered) {
			return
		}

		const codeEncoded = this.getAttribute('code')
		if (!codeEncoded) {
			return
		}

		const code = decodeURIComponent(codeEncoded)
		this.innerHTML =
			'<div style="color: #888; padding: 10px;">Loading diagram...</div>'

		try {
			// 动态导入 mermaid
			const { default: mermaid } = await import('mermaid')

			const config: MermaidConfig = {
				startOnLoad: false,
				theme: 'base',
				// 如果需要，这里可以根据 window.matchMedia('(prefers-color-scheme: dark)') 设置 'dark'
			}

			mermaid.initialize(config)

			const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`

			// render 返回的是 Promise<{ svg: string, bindFunctions?: ... }>
			const { svg } = await mermaid.render(id, code)

			this.innerHTML = svg

			const renderedSvg = this.querySelector('svg')
			if (renderedSvg instanceof SVGSVGElement) {
				this.prepareSVG(renderedSvg)
			}

			this._rendered = true
			this.removeAttribute('data-hidden')
			this.prepareHost()

			if (renderedSvg instanceof SVGSVGElement) {
				requestAnimationFrame(() => {
					dispatchPanZoomViewerContentReady(this, {
						kind: 'svg',
						target: renderedSvg,
					})
				})
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err)
			this.innerHTML = `<pre style="color: red; padding: 10px; border: 1px solid red;">Mermaid Error: ${errorMessage}</pre>`
			this.removeAttribute('data-hidden')
		}
	}

	private prepareSVG(svg: SVGSVGElement): void {
		svg.style.display = 'block'
		svg.removeAttribute('width')
		svg.removeAttribute('height')
		svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
		svg.style.width = 'auto'
		svg.style.height = 'auto'
		svg.style.maxWidth = '100%'
		svg.style.maxHeight = '100%'
		svg.style.margin = '0 auto'
		svg.style.flex = '0 0 auto'
	}

	private prepareHost(): void {
		this.style.display = 'block'
		this.style.width = `var(${PAN_ZOOM_VIEWER_WIDTH_VAR}, 100%)`
		this.style.height = 'auto'

		if (this.closest('pan-zoom-viewer')) {
			this.style.height = `var(${PAN_ZOOM_VIEWER_HEIGHT_VAR}, 100%)`
			this.style.display = 'flex'
			this.style.alignItems = 'center'
			this.style.justifyContent = 'center'
			this.style.overflow = 'visible'
		}
	}
}

if (!customElements.get('mermaid-viewer')) {
	customElements.define('mermaid-viewer', MermaidViewer)
}

declare global {
	interface HTMLElementTagNameMap {
		'mermaid-viewer': MermaidViewer
	}
}
