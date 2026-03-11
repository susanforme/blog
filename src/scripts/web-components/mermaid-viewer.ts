import type { MermaidConfig } from 'mermaid'

import { dispatchPanZoomViewerContentReady } from './constant'

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

		this.style.display = 'block'

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

			if (renderedSvg instanceof SVGSVGElement) {
				dispatchPanZoomViewerContentReady(this, {
					kind: 'svg',
					target: renderedSvg,
				})
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err)
			this.innerHTML = `<pre style="color: red; padding: 10px; border: 1px solid red;">Mermaid Error: ${errorMessage}</pre>`
		}
	}

	private prepareSVG(svg: SVGSVGElement): void {
		svg.style.display = 'block'
		svg.style.maxWidth = 'none'

		const { width, height } = svg.viewBox.baseVal
		if (width > 0) {
			svg.style.width = `${width}px`
		}

		if (height > 0) {
			svg.style.height = `${height}px`
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
