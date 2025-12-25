// plugins/remark-custom-blocks.mjs
import { visit } from 'unist-util-visit'

export function remarkCustomBlocks(base = '') {
	return (tree) => {
		visit(tree, 'code', (node) => {
			const lang = node.lang || ''
			const codeContent = node.value

			// 1. Mermaid: 转换为 <mermaid-viewer> 标签
			if (lang === 'mermaid') {
				node.type = 'html'
				node.value = `<mermaid-viewer data-hidden code="${encodeURIComponent(codeContent)}">
           </mermaid-viewer>`
				return
			}

			if (lang === 'html-box') {
				node.type = 'html'
				node.value = `
					<html-box code="${encodeURIComponent(codeContent)}">
					</html-box>
				`
				return
			}

			if (lang === 'iframe') {
				node.type = 'html'
				node.value = `
					<iframe src="${base}${codeContent}">
					</iframe>
				`
				return
			}

			if (lang === 'inline') {
				node.type = 'html'
				node.value = `
          <inline-preview code="${encodeURIComponent(codeContent)}">
            <div slot="preview">${codeContent}</div>
          </inline-preview>
        `
				return
			}
		})
	}
}
