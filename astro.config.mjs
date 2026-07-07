import { defineConfig, passthroughImageService } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import { unified } from '@astrojs/markdown-remark'
import icon from 'astro-icon'
import rehypeFigureTitle from 'rehype-figure-title'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs'
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs'
import { remarkCustomBlocks } from './src/plugins/remark-custom-blocks.mjs'

const isGithub = !(process.env.VERCEL || process.env.NODE_ENV !== 'production')
const base = isGithub ? '/blog' : ''
const emptyMonacoIpadKeyboardCss = '\0empty-monaco-ipad-keyboard-css'
const ignoreMonacoIpadKeyboardCss = {
	name: 'ignore-monaco-ipad-keyboard-css',
	enforce: 'pre',
	resolveId(id) {
		if (id.endsWith('/iPadShowKeyboard.css')) {
			return emptyMonacoIpadKeyboardCss
		}
	},
	load(id) {
		if (id === emptyMonacoIpadKeyboardCss) {
			return ''
		}
	},
}

// https://astro.build/config
export default defineConfig({
	site: isGithub
		? 'https://susanforme.github.io/blog/'
		: 'https://springbreeze.vercel.app/',
	base,
	image: {
		service: passthroughImageService(),
	},
	integrations: [
		mdx(),
		sitemap(),
		icon({
			include: {
				mdi: ['*'],
				pixelarticons: ['*'],
			},
		}),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
	],
	vite: {
		plugins: [ignoreMonacoIpadKeyboardCss, tailwindcss()],
		optimizeDeps: {
			include: [
				'@panzoom/panzoom',
				'astro/runtime/client/dev-toolbar/entrypoint.js',
				'mermaid',
				'monaco-editor/esm/vs/basic-languages/html/html.contribution.js',
				'monaco-editor/esm/vs/editor/editor.api.js',
			],
		},
	},
	markdown: {
		processor: unified({
			remarkPlugins: [
				remarkReadingTime,
				remarkModifiedTime,
				remarkCustomBlocks(base),
			],
			rehypePlugins: [rehypeFigureTitle, rehypeAccessibleEmojis],
		}),
	},
})
