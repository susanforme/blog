import { defineConfig, passthroughImageService } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import icon from 'astro-icon'
import rehypeFigureTitle from 'rehype-figure-title'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs'
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs'
import { remarkCustomBlocks } from './src/plugins/remark-custom-blocks.mjs'

const isGithub = !(process.env.VERCEL || process.env.NODE_ENV !== 'production')
const base = isGithub ? '/blog' : ''
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
		plugins: [tailwindcss()],
	},
	markdown: {
		remarkPlugins: [
			remarkReadingTime,
			remarkModifiedTime,
			remarkCustomBlocks(base),
		],
		rehypePlugins: [rehypeFigureTitle, rehypeAccessibleEmojis],
	},
})
