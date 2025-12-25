// src/components/CodePlayground.ts
import type { editor } from 'monaco-editor'
import { HTMLSandBox } from '../util'

interface LogEntry {
	type: 'log' | 'error' | 'warn'
	message: string
}

class CodePlayground extends HTMLElement {
	private sandBox: HTMLSandBox | null = null // 根据 HTMLSandBox 的实际类型调整
	private editorInstance: editor.IStandaloneCodeEditor | null = null
	private _rendered: boolean = false

	constructor() {
		super()
		// 绑定 this 指向
		this.handleTabClick = this.handleTabClick.bind(this)
	}

	async connectedCallback() {
		if (this._rendered) {
			return
		}

		const codeEncoded = this.getAttribute('code') || ''
		const initialCode = decodeURIComponent(codeEncoded)

		// 1. 初始化基础 DOM 结构
		this.renderSkeleton()

		try {
			// 2. 动态加载依赖 (保持与 MermaidViewer 一致的懒加载模式)
			await import('../init-worker')
			const monaco = await import('monaco-editor')

			// 3. 初始化沙箱
			const htmlContainer =
				this.querySelector<HTMLDivElement>('#html-container')
			if (htmlContainer) {
				this.sandBox = new HTMLSandBox({
					container: htmlContainer,
					callback: (output: LogEntry) => this.appendLog(output),
				})
			}

			// 4. 初始化 Monaco Editor
			const editorContainer =
				this.querySelector<HTMLDivElement>('#monaco-container')
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

				// 5. 监听代码变更
				this.editorInstance.onDidChangeModelContent(() => {
					this.clearLogs()
					this.runCode(this.editorInstance?.getValue() || '')
				})
			}

			// 初次运行代码
			this.runCode(initialCode)
			this._rendered = true
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err)
			this.innerHTML = `<div style="color: red; padding: 20px;">Load Error: ${msg}</div>`
		}
	}

	private renderSkeleton(): void {
		this.innerHTML = `
      <style>
        .playground {
          display: flex;
          height: 100%;
          min-height: 450px;
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
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
        }
        .tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .tab-btn {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
        }
        .tab-btn.active {
          color: #2563eb;
          background: #fff;
          box-shadow: inset 0 -2px 0 #2563eb;
        }
        .pane {
          display: none;
          flex: 1;
          overflow: auto;
        }
        .pane.active {
          display: block;
        }
        #log-list {
          padding: 12px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 13px;
        }
        .item {
          display: flex;
          border-bottom: 1px solid #f1f5f9;
          padding: 6px 0;
          line-height: 1.5;
        }
        .item-type {
          font-weight: bold;
          margin: 0 8px;
          text-transform: uppercase;
          font-size: 11px;
        }
        .log { color: #94a3b8; }
        .error { color: #ef4444; }
        .warn { color: #f59e0b; }
        #html-container { width: 100%; height: 100%; }
        #html-container iframe { width: 100%; height: 100%; border: none; }
      </style>
      <div class="playground">
        <div class="editor-wrapper" id="monaco-container"></div>
        <div class="output-wrapper">
          <div class="tabs">
            <button class="tab-btn active" data-tab="preview">PREVIEW</button>
            <button class="tab-btn" data-tab="logs">LOGS</button>
          </div>
          <div id="preview" class="pane active">
            <div id="html-container"></div>
          </div>
          <div id="logs" class="pane">
            <div id="log-list"></div>
          </div>
        </div>
      </div>
    `

		const tabButtons = this.querySelectorAll('.tab-btn')
		tabButtons.forEach((btn) => {
			btn.addEventListener('click', (e) => this.handleTabClick(e as MouseEvent))
		})
	}

	private handleTabClick(event: MouseEvent): void {
		const selectedBtn = event.currentTarget as HTMLButtonElement
		const targetTabId = selectedBtn.dataset.tab

		this.querySelectorAll('.tab-btn').forEach((btn) => {
			btn.classList.toggle('active', btn === selectedBtn)
		})

		this.querySelectorAll('.pane').forEach((pane) => {
			pane.classList.toggle('active', pane.id === targetTabId)
		})
	}

	private runCode(code: string): void {
		try {
			if (this.sandBox) {
				this.sandBox.run(code)
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			this.appendLog({ type: 'error', message })
		}
	}

	private appendLog({ type, message }: LogEntry): void {
		const logList = this.querySelector('#log-list')
		if (!logList) {
			return
		}

		const div = document.createElement('div')
		div.className = 'item'
		div.innerHTML = `
      <span style="color: #cbd5e1">[</span>
      <span class="item-type ${type}">${type}</span>
      <span style="color: #cbd5e1">] :</span>
      <span style="margin-left: 8px;">${this.escapeHtml(message)}</span>
    `
		logList.appendChild(div)
	}

	private escapeHtml(str: string): string {
		return str.replace(
			/[&<>"']/g,
			(m) =>
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					'"': '&quot;',
					"'": '&#39;',
				})[m] || m
		)
	}

	private clearLogs(): void {
		const logList = this.querySelector('#log-list')
		if (logList) {
			logList.innerHTML = ''
		}
	}

	disconnectedCallback(): void {
		if (this.editorInstance) {
			this.editorInstance.dispose()
		}
		if (this.sandBox && typeof this.sandBox.destory === 'function') {
			this.sandBox.destory()
		}
		// 移除事件监听
		const tabButtons = this.querySelectorAll('.tab-btn')
		tabButtons.forEach((btn) => {
			btn.removeEventListener('click', (e) =>
				this.handleTabClick(e as MouseEvent)
			)
		})
	}
}

// 定义标签
const TAG_NAME = 'code-playground'
if (!customElements.get(TAG_NAME)) {
	customElements.define(TAG_NAME, CodePlayground)
}

// 类型声明
declare global {
	interface HTMLElementTagNameMap {
		'code-playground': CodePlayground
	}
}

export default CodePlayground
