// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Spring Breeze'
export const SITE_DESCRIPTION =
	'A simple theme for personal blog sites, created for Astro framework'

// If you deploy to a subdirectory, set the `WEBSITE_BASE` here.
// e.g. '/blog' if you are deploying to example.com/blog
// Leave it as an empty string if you are deploying to a root domain (e.g. example.com)

export const isGithub = !(
	import.meta.env.VERCEL || import.meta.env.NODE_ENV !== 'production'
)

export const SITE_BASE = isGithub ? '/blog' : ''

export const SocialLinks = [
	{
		name: 'GitHub',
		url: 'https://github.com/susanforme',
	},
]

export const WebsiteLinks = [
	{
		name: 'Home',
		url: '/',
	},
	{
		name: 'Posts',
		url: '/posts',
	},
	{
		name: 'About',
		url: '/about',
	},
].map(({ url, ...rest }) => {
	if (url === '/' && SITE_BASE) {
		url = ''
	}
	return {
		...rest,
		url: SITE_BASE + url,
	}
})
