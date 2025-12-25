// src/components/CodePlayground.ts
import type { editor } from 'monaco-editor'
import { HTMLSandBox } from '../util'
import monacoStyles from 'monaco-editor/min/vs/editor/editor.main.css?inline'
interface LogEntry {
	type: 'log' | 'error' | 'warn'
	message: string
}

class HtmlBox extends HTMLElement {
	private sandBox: HTMLSandBox | null = null
	private editorInstance: editor.IStandaloneCodeEditor | null = null
	private _rendered: boolean = false
	shadowRoot!: ShadowRoot

	constructor() {
		super()
		this.shadowRoot = this.attachShadow({ mode: 'open' })
		this.handleTabClick = this.handleTabClick.bind(this)
	}

	async connectedCallback() {
		if (this._rendered) {
			return
		}

		const codeEncoded = this.getAttribute('code') || ''
		const initialCode = decodeURIComponent(codeEncoded)

		// 2. 初始化结构
		this.renderSkeleton()

		try {
			await import('../init-worker')
			const monaco = await import('monaco-editor')

			const htmlContainer =
				this.shadowRoot.querySelector<HTMLDivElement>('#html-container')
			if (htmlContainer) {
				this.sandBox = new HTMLSandBox({
					container: htmlContainer,
					callback: (output: LogEntry) => this.appendLog(output),
				})
			}

			const editorContainer =
				this.shadowRoot.querySelector<HTMLDivElement>('#monaco-container')
			if (editorContainer) {
				this.editorInstance = monaco.editor.create(editorContainer, {
					value: initialCode,
					language: 'html',
					theme: 'vs',
					automaticLayout: true,
					fontSize: 18,
					minimap: { enabled: false },
					fixedOverflowWidgets: true,
					scrollBeyondLastLine: false,
					padding: { top: 10, bottom: 10 },
				})

				this.editorInstance.onDidChangeModelContent(() => {
					this.clearLogs()
					this.runCode(this.editorInstance?.getValue() || '')
				})
			}

			this.runCode(initialCode)
			this._rendered = true
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err)
			this.shadowRoot.innerHTML = `<div style="color: red; padding: 20px;">Load Error: ${msg}</div>`
		}
	}

	private renderSkeleton(): void {
		// 将样式和 HTML 注入 Shadow Root
		this.shadowRoot.innerHTML = `
      <style>
      *{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      iframe{
        border: none;
        width: 100%;
      }
      ${monacoStyles}
        :host {
          display: block;
          width: 100%;
          margin: 1rem 0;
        }
        .playground {
          display: flex;
          height: 500px; /* 固定高度防止塌陷 */
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .editor-wrapper {
          width: 50%;
          height: 100%;
          border-right: 1px solid #e2e8f0;
        }
        .output-wrapper {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          position: relative;
        }
        .tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding-right: 40px; /* 为右上角全屏图标留出空间 */
        }
        .tab-btn {
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          text-transform: lowercase;
        }
        .tab-btn.active {
          color: #1e293b;
          background: #fff;
          box-shadow: inset 0 -2px 0 #3b82f6;
        }
        .pane {
          display: none;
          flex: 1;
          overflow: auto;
        }
        .pane.active {
          display: block;
        }
        #html-container {
          width: 100%;
          height: 100%;
        }
      
        #html-container :shadow-deep(iframe), 
        #html-container iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
        #log-list {
          padding: 12px;
          font-family: monospace;
          font-size: 13px;
        }
        .item {
          border-bottom: 1px solid #f1f5f9;
          padding: 6px 0;
          word-break: break-all;
        }
        .log { color: #64748b; }
        .error { color: #ef4444; }
        .warn { color: #f59e0b; }
        .fullscreen-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          cursor: pointer;
          opacity: 0.6;
        }
      </style>
      <div class="playground">
        <div class="editor-wrapper" id="monaco-container"></div>
        <div class="output-wrapper">
          <div class="tabs">
            <button class="tab-btn active" data-tab="preview">preview</button>
            <button class="tab-btn" data-tab="logs">logs</button>
          </div>
          <svg class="fullscreen-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          <div id="preview" class="pane active">
            <div id="html-container"></div>
          </div>
          <div id="logs" class="pane">
            <div id="log-list"></div>
          </div>
        </div>
      </div>
    `

		this.shadowRoot
			.querySelector('.fullscreen-icon')
			?.addEventListener('click', () => {
				this.shadowRoot.querySelector('.playground')?.requestFullscreen()
			})
		// 从 root 中查找按钮
		const tabButtons = this.shadowRoot.querySelectorAll('.tab-btn')
		tabButtons.forEach((btn) => {
			btn.addEventListener('click', (e) => this.handleTabClick(e as MouseEvent))
		})
	}

	private handleTabClick(event: MouseEvent): void {
		const selectedBtn = event.currentTarget as HTMLButtonElement
		const targetTabId = selectedBtn.dataset.tab

		this.shadowRoot.querySelectorAll('.tab-btn').forEach((btn) => {
			btn.classList.toggle('active', btn === selectedBtn)
		})

		this.shadowRoot.querySelectorAll('.pane').forEach((pane) => {
			pane.classList.toggle('active', pane.id === targetTabId)
		})
	}

	private runCode(code: string): void {
		try {
			if (this.sandBox) {
				this.sandBox.run(code)
			}
		} catch (err) {
			this.appendLog({ type: 'error', message: String(err) })
		}
	}

	private appendLog({ type, message }: LogEntry): void {
		const logList = this.shadowRoot.querySelector('#log-list')
		if (!logList) {
			return
		}

		const div = document.createElement('div')
		div.className = `item ${type}`
		div.textContent = `[${type.toUpperCase()}] : "${message}"`
		logList.appendChild(div)
	}

	private clearLogs(): void {
		const logList = this.shadowRoot.querySelector('#log-list')
		if (logList) logList.innerHTML = ''
	}

	disconnectedCallback(): void {
		if (this.editorInstance) this.editorInstance.dispose()
		if (this.sandBox && typeof this.sandBox.destory === 'function')
			this.sandBox.destory()

		const tabButtons = this.shadowRoot.querySelectorAll('.tab-btn')
		tabButtons.forEach((btn) => {
			btn.removeEventListener('click', (e) =>
				this.handleTabClick(e as MouseEvent)
			)
		})
	}
}

const TAG_NAME = 'html-box'
if (!customElements.get(TAG_NAME)) {
	customElements.define(TAG_NAME, HtmlBox)
}

export default HtmlBox
