import { defineConfig } from 'vitepress';
// 导入主题的配置
import { blogTheme } from './blog-theme';

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  base: '/blog',
  lang: 'zh-cn',
  title: "桃花笑春风's blog",
  description: '桃花笑春风 blog',
  lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录',
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: 'https://avatars.githubusercontent.com/u/51266600',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      { text: '首页', link: '/' },
      { text: '关于作者', link: 'https://github.com/susanforme' },
    ],
  },
  vite: {
    optimizeDeps: {
      include: ['mermaid', 'monaco-editor'],
    },
    plugins: [],
  },
  markdown: {
    async config(md) {
      const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules);
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const map: Record<string, string> = {
          mermaid: `<Mermaid code="${encodeURIComponent(token.content)}" />`,
          iframe: `<frame-box src="${token.content}" />`,
          sandpack: `<Sandpack code="${encodeURIComponent(token.content)}" />`,
        };
        const info = token.info.trim();
        if (map[info]) {
          return map[info];
        }
        return defaultFence(tokens, idx, options, env, self);
      };
    },
  },
});
