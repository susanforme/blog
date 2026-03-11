---
title: 基于ASTRO的高性能SSG方案
description: 使用Astro静态站点生成器构建高性能网站,深入理解SSG、水合等核心概念
pubDate: 2025-12-20
---

<!-- 搞一个keynote风格的演讲稿 纯前端 Framer
Motion（React 技术宣讲神器） 适合：对外技术页 / Keynote 风格宣讲 -->

## 引言

在现代前端开发中，静态站点生成器（SSG）因其高性能和良好的用户体验而受到广泛关注。Astro 作为一种新兴的静态站点生成器，凭借其独特的架构和优化策略，为开发者提供了强大的工具来构建高效的静态网站。本文将探讨基于 Astro 的高性能 SSG 方案，介绍其核心概念、优势以及实际应用案例。

## 前置知识

在深入了解基于 Astro 的高性能 SSG 方案之前，读者需要具备以下前置知识：

### 核心概念

- **水合**: 了解VUE/React等前端框架的水合原理
- **SSG**：了解 SSG 的基本原理和工作流程。
- **Astro 框架**：了解 Astro 的基本使用方法和特点。

## 水合

Dan Abramov（Create React App 和 Redux）对 Hydration 的定义是：_“Hydration 就像用用户交互和事件处理程序的‘水’来浇灌‘干燥的’HTML。”_

### CSR**客户端渲染**

客户端渲染是指所有页面都直接在浏览器中使用 JavaScript 加载和渲染。这样，浏览器负责处理所有请求（_数据获取_）、管理加载状态以及其他交互操作。
![image-20251220124347208](./img/csr.png)

> 代码结构

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>CSR Example</title>
	</head>
	<body>
		<!-- 注意这里几乎没有内容，只有一个挂载点 -->
		<div id="root"></div>

		<!-- JavaScript 负责渲染整个页面 -->
		<script src="/bundle.js"></script>
	</body>
</html>
```

### SSR服务端渲染

在服务器端渲染（SSR）中，页面在服务器端使用 JavaScript 生成，并以 HTML 格式发送给客户端。此过程优化了服务器端的数据获取，从而提升了用户体验。在 SSR 中，初始 HTML 加载完毕后，交互所需的 JavaScript 代码会在后台加载。

![image-20251220124526785](./img/ssr.png)

> 代码结构

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>SSR Example</title>
	</head>
	<body>
		<!-- 服务器已经渲染好 HTML -->
		<div id="root">
			<h1>欢迎来到 SSR 页面</h1>
			<p>这是服务器端渲染生成的内容。</p>
			<button onclick="alert('按钮点击事件')">点击我</button>
		</div>

		<!-- JavaScript 只负责 Hydration -->
		<script src="/bundle.js"></script>
	</body>
</html>
```

### **什么是水合**

**水合Hydration**是指将服务器端预渲染的 HTML 代码在浏览器中实现交互的过程。换句话说，框架(React,Vue)会检查现有的 HTML 代码，并关联必要的 JavaScript 代码来激活组件，从而实现交互功能。

这样可以加快页面加载速度，因为静态内容（初始 HTML）会快速加载，交互功能随后才会启用。

这种做法结合了 SSR 和 CSR（客户端渲染）的优点：

- **服务器端渲染（SSR）** 提供了更快的首屏加载时间和更好的 SEO。
- **客户端渲染（CSR）** 提供了更丰富的交互体验。

![image-20251220125059048](./img/react-ssr.png)

> 值得注意的是，*水合作用*并不直接适用于仅在客户端运行的库或框架（_仅限客户端_），例如仅在客户端使用的 React。

除了传统的 Web 开发和现代前端框架外，在一些其他场景中也存在类似的 Hydration 过程：

- **静态站点生成（SSG）** ：在静态站点生成器（如 Gatsby、Next.js 的静态导出模式）中，初始页面会在构建时生成静态 HTML。客户端加载后，这些静态内容通过 JavaScript 变得动态和可交互。
- **增量静态渲染（ISR）** ：某些现代框架（如 Next.js 提供的 ISR）允许静态页面在构建后的特定时间内动态更新，而客户端加载的过程中依然需要进行 Hydration。

## SSG

### 什么是静态网站生成器？

静态网站生成器是一种基于原始数据和一组模板生成完整静态 HTML 网站的工具。从本质上讲，静态站点生成器自动完成对单个 HTML 页面进行编码的任务，并让这些页面提前准备好为用户提供服务。因为这些 HTML 页面是预先构建的，所以它们可以在用户的浏览器中非常快速地加载。

静态网站生成器是内容管理系统 (CMS) 的替代品，后者是另一种用于管理 Web 内容、生成网页和实施模板的工具。（模板是 Web 内容的可重用格式；开发人员使用模板来避免一遍又一遍地编写相同的格式。）

### 什么是静态网站？

静态网站由一个或多个 HTML 网页组成，这些网页每次都以相同的方式加载。静态网站与动态网站形成对比，动态网站根据一些不断变化的数据输入（例如用户的位置、一天中的时间或用户操作）进行不同的加载。静态网页是可以快速加载的简单 HTML 文件，而动态网页需要在浏览器中执行 JavaScript 代码才能呈现。

### 静态网站生成器和 CMS 之间有什么区别？

在互联网的早期，网站被存储为静态 HTML 站点，所有网页都预先布局和硬编码。这是低效的，因为它需要开发人员手动编码每个网页。

内容管理系统 (CMS) 的出现让开发人员能够避免所有这些手动设置。内容存储在 CMS 数据库中，而不是提前对页面进行编码，当用户请求页面时，服务器会执行以下操作：

1. 查询数据库，寻找正确的内容
2. 识别该内容将适合的模板
3. 生成页面
4. 向用户提供页面

CMS 中的内容必须适合 CMS 数据库提供的字段之一，但只要符合要求，它就应该每次都出现在网站上的适当位置。

静态站点生成器是这两种方法的折衷方案。与 CMS 一样，它允许开发人员使用模板并自动生成网页——但它会提前完成后者，而不是响应用户的请求。这可以提高[网站性能](https://www.cloudflare.com/learning/performance/why-site-speed-matters/)，因为网页可以立即交付给最终用户。它还为开发人员提供了更大的定制能力，因为他们不受 CMS 提供的数据库字段的限制。

### 使用静态站点生成器有哪些优缺点？

#### 优点

- **性能**因为静态站点生成器提前而不是按需（比如使用 CMS）创建网页，所以网页在用户浏览器中的加载速度稍快。
- **定制**开发人员可以创建他们想要的任何模板。它们不受 CMS 提供的字段限制，也不受 CMS 内置模板的限制。
- **更轻的后台**静态网站是轻量级的，不需要在服务器端运行那么多代码，而基于 CMS 的网站会不断地向服务器端查询内容。

#### 缺点

- **很少或没有预制模板**无限定制的缺点是可能需要更长的时间才能开始。许多静态网站生成器不附带模板，开发人员一开始要花很多时间从头开始建立模板。
- **没有用户友好的界面**非开发人员用户更难使用静态站点生成器发布内容。没有 CMS 界面，处理未格式化的原始数据可能会让用户望而生畏。此外，进行网站更新通常需要开发人员支持。

## Astro

**Astro 是一个集多功能于一体的 Web 框架。**它内置包含了你构建网站所需的一切。还有数百个不同的[集成](https://astro.build/integrations/)和 [API 钩子](https://docs.astro.build/zh-cn/reference/integrations-reference/)可根据你的具体用例和需求定制你的项目。**Astro** 是最适合构建像博客、营销网站、电子商务网站这样的**以内容驱动的网站**的 Web 框架。Astro 以开创了一种新的[前端架构](https://docs.astro.build/zh-cn/concepts/islands/)而闻名，与其他框架相比它减少了 JavaScript 的开销和复杂性。如果你需要一个加载速度快、具有良好 SEO 的网站，那么 Astro 就是你的选择。

一些亮点包括：

- **[群岛](https://docs.astro.build/zh-cn/concepts/islands/)**：一种基于组件的针对内容驱动的网站进行优化的 Web 架构。
- **[UI 无关](https://docs.astro.build/zh-cn/guides/framework-components/)**：支持 React、Preact、Svelte、Vue、Solid、HTMX、Web 组件等等。
- **[服务器优先](https://docs.astro.build/zh-cn/guides/on-demand-rendering/)**：将沉重的渲染移出访问者的设备。
- **[默认无 JS](https://docs.astro.build/zh-cn/basics/astro-components/)**：让客户端更少的执行 JS ，以提升网站速度。
- **[内容集合](https://docs.astro.build/zh-cn/guides/content-collections/)**：为你的 Markdown 内容，提供组织、校验并保证 TypeScript 类型安全。
- **[可定制](https://docs.astro.build/zh-cn/guides/integrations-guide/)**：Partytown、MDX 和数百个集成可供选择。

### 群岛架构

> “群岛” 架构的总体思想看似简单：在服务器上渲染 HTML 页面，并在高度动态的区域周围注入占位符或插槽 […] 这些区域随后可以在客户端 “激活” 成为小型独立的小部件，重用它们服务器渲染的初始 HTML。 — Jason Miller, Preact 的创造者

这种架构模式所依赖的技术也被称为 **局部化**或**选择性激活**。

渐进式水合技术在 React、Angular、Preact 和 Vue 等框架中的性能优势。在这些架构中，页面上的各个组件会随着时间的推移逐步加载和初始化。这可以通过 requestIdleCallback 实现简单的调度，也可以考虑视口可见性、交互可能性、产品价值等其他因素。

与渐进式水合作用类似，使用岛屿架构渲染页面，不仅能逐步初始化页面中较复杂的动态部分，还能*分别*初始化。这意味着页面的各个区域无需先加载其他内容即可实现交互。

与渐进式水合作用不同，基于**岛屿架构**构建的方法不需要自顶向下渲染。这是一个显著的优势，因为没有必须在子组件初始化之前初始化的外部“根”组件。页面的每个部分都是一个独立的单元，一个单元中的性能问题不会影响其他单元。

![](./img//island.png)

### Astro的群岛架构实现

```ts
class AstroIsland extends HTMLElement {
	public Component: any
	public hydrator: any

	async connectedCallback() {
		// 等待子节点加载完成（处理 HTML 流式传输的情况）
		if (
			this.hasAttribute('await-children') &&
			document.readyState !== 'complete'
		) {
			const mo = new MutationObserver(() => {
				if (this.lastChild?.nodeValue === 'astro:end') {
					mo.disconnect()
					this.start()
				}
			})
			mo.observe(this, { childList: true })
		} else {
			this.start()
		}
	}

	async start() {
		const opts = JSON.parse(this.getAttribute('opts')!)
		const directive = this.getAttribute('client') as string // 如: 'load', 'visible'

		// 调用指令对应的加载策略 (例如：在空闲时加载、在可见时加载)
		if (Astro[directive] === undefined) {
			window.addEventListener(`astro:${directive}`, () => this.start(), {
				once: true,
			})
			return
		}

		await Astro[directive]!(
			async () => {
				const rendererUrl = this.getAttribute('renderer-url')
				// 1. 动态导入：并行加载组件代码和注水器(Hydrator)代码
				const [componentModule, { default: hydrator }] = await Promise.all([
					import(this.getAttribute('component-url')!),
					rendererUrl ? import(rendererUrl) : () => () => {},
				])

				// 2. 确定导出组件的名字（默认是 'default'）
				const exportName = this.getAttribute('component-export') || 'default'
				this.Component = componentModule[exportName]
				this.hydrator = hydrator

				return this.hydrate // 返回注水函数供指令调用
			},
			opts,
			this
		)
	}

	hydrate = async () => {
		if (!this.hydrator || !this.isConnected) return

		// 递归等待：如果父级也是孤岛且未激活，先等父级注水，确保自顶向下激活
		const parentSsrIsland = this.parentElement?.closest('astro-island[ssr]')
		if (parentSsrIsland) {
			parentSsrIsland.addEventListener('astro:hydrate', this.hydrate, {
				once: true,
			})
			return
		}

		// 解析插槽 (Slots)
		const slots: Record<string, string> = {}
		for (const slot of this.querySelectorAll('astro-slot')) {
			if (slot.closest(this.tagName) !== this) continue
			slots[slot.getAttribute('name') || 'default'] = slot.innerHTML
		}

		// 解析 Props（通过前面的 revive 逻辑）
		const props = this.hasAttribute('props')
			? reviveObject(JSON.parse(this.getAttribute('props')!))
			: {}

		// 最终注水：调用渲染器（如 React, Vue 的渲染函数）将组件挂载到 DOM
		const hydrator = this.hydrator(this)
		await hydrator(this.Component, props, slots, {
			client: this.getAttribute('client'),
		})

		// 标记注水完成，触发事件
		this.removeAttribute('ssr')
		this.dispatchEvent(new CustomEvent('astro:hydrate'))
	}
}

// 注册自定义元素
if (!customElements.get('astro-island')) {
	customElements.define('astro-island', AstroIsland)
}
```

## 技术取舍

在选择使用 Astro 作为静态站点生成器时，需要考虑以下技术取舍：

- **性能 vs. 灵活性**：Astro 默认情况下提供了出色的性能，但在某些情况下，可能需要牺牲一些灵活性来实现最佳性能。
- **集成复杂性**：将 Astro 集成到现有项目中可能需要额外的工作，特别是如果现有项目已经使用了其他框架或技术栈。

在团队主应用采用Nuxt的情况下,经过综合考虑,决定采用Astro 结合Vue 3 来实现高性能的静态站点生成方案。以此达到性能和开发效率的平衡。

### 为什么?

在主应用采用Nuxt 框架的情况下，使用Astro结合Vue 3 有以下优势：

1. **无额外性能成本** : Astro 支持多种前端框架（包括 Vue 3），因此可以无缝集成到现有的 Vue 3 项目中.而主应用采用Nuxt 框架,本身也是基于Vue 3 构建的. 这样可以最大限度地减少性能开销。 可以将Astro 生成的静态内容直接嵌入到 Nuxt 应用中.需要客户端水合的部分,只需加载必要的Vue3即可.而 Vue 3 本身已经由 Nuxt 应用加载, 所以 不会引入额外的框架开销。
2. **提升性能** : Astro 的群岛架构允许只为需要交互的部分加载 JavaScript，从而显著减少初始加载时间和提高页面响应速度。这对于提升用户体验和 SEO 非常有利。
3. **开发效率** : 使用 Vue 3 作为前端框架，可以利用现有的 Vue 生态系统和工具链，提高开发效率。同时，Astro 提供了简洁的语法和强大的功能，使得构建静态站点更加高效。

## 那么问题来了

如何优雅的将Astro 集成到现有项目中？如何在不影响现有主站SSR框架(Nuxt,Next等)架构的前提下，提升网站性能？
有如下问题需要面对:

1. 如何处理Astro编译产物与现有主站SSR框架的集成？
   如下是一个最简的Astro 项目结合Vue3 编译的产物示例

   ```html
      <!DOCTYPE html>
      <html lang="en"></html>
   <head>
     <meta name="generator" content="Astro v5.16.0">
     <link rel="stylesheet" href="./assets/styles.css">
   </head>
   <body>
     <div class="lp-new-area" data-app="vivaia">
       <style>
         astro-island,
         astro-slot,
         astro-static-slot {
           display: contents
         }
       </style>
       <script></script>
       <script>
   		 预编译的Astro Island 组件加载脚本
   		</script>
       <astro-island uid="PDDNA" prefix="s0"
         component-url="./assets/_app.BXJsAGJH.js" component-export="default"
         renderer-url="./assets/client.DAeD31y9.js" props="{}" ssr client="visible"
         opts="{&quot;name&quot;:&quot;VueApp&quot;,&quot;value&quot;:true}"
         await-children><!--[-->
         <div>
   			  Vue 组件渲染的html内容
   			 </div><!--]--><!--astro:end-->
       </astro-island>
     </div>
   </body>
   
   </html>
   ```

2. 如何处理Astro编译产物中的静态资源引用路径问题？
   由于Astro 编译产物中的静态资源引用路径通常是相对路径,而现有主站SSR框架(Nuxt,Next等)的静态资源路径可能不同,需要对这些路径进行处理,以确保资源能够正确加载。
3. 如何确保Astro Vue 3 中的客户端水合逻辑能够正确执行？
   需要确保Astro 生成的Vue 3 组件在客户端能够正确水合,并且不会与现有主站SSR框架(Nuxt,Next等)的水合逻辑冲突。

4. 如何处理国际化的问题

5. 如何处理在服务端渲染和客户端渲染使用相同Astro产物可能引发的问题？

## 处理ASTRO编译产物与现有主站SSR框架的集成

假设你已经拿到了 Astro `build` 之后的 `index.html`，现在要把它塞进 Nuxt 这类 SSR 主站。很多人第一反应是：不就是把这份 HTML 当字符串输出到服务端模板里吗？

真正落地时你会发现，事情没这么简单。

- 内容是能显示，但 `astro-island` 不一定还能激活。
- 样式是能生效，但也可能污染主站原来的模块。
- 主站只想要一段业务片段，Astro 给你的却是一整页文档。

所以这里的问题，不是“怎么把 HTML 拼进去”，而是**怎么把 Astro 的默认编译产物，转换成 SSR 主站真正需要的交付形态**。

先给这件事一个轮廓。这个问题本质上有四层：

1. 先定义一条稳定的业务边界。
2. 把 HTML、样式、Island 运行时代码拆出来。
3. 补上宿主环境自己的启动逻辑。
4. 按宿主的执行模型重新组装。

下面就按这四步来看。

### 第一步：不要直接消费整页 HTML，而是先定义“业务边界”

Astro 默认输出的是完整文档，但 SSR 主站本身已经控制了 `<html>`、`<head>`、`<body>`。主站真正要接入的，其实不是一整页，而是某个业务区域。

所以这段代码先约定：页面内容必须被 `<lp-app>` 包起来。到了构建完成阶段，只提取这一段。

```ts
const reg = /<lp-app>([\s\S]*?)<\/lp-app>/;

'astro:build:done': async ({ dir }) => {
  const distDir = fileURLToPath(dir);
  const indexPath = path.join(distDir, 'index.html');
  const originHtml = await fs.readFile(indexPath, 'utf-8');

  const appMatch = originHtml.match(reg);
  if (!appMatch) {
    throw new Error('未找到匹配的<lp-app>标签');
  }

  const lpAppHTML = appMatch[0];
}
```

这一步最容易被低估，但它其实是整个方案能不能稳定运行的前提。

因为一旦没有这条边界，后处理逻辑就只能去猜：到底是整个 `body` 要被拿走，还是只拿某个节点，哪些脚本属于业务区，哪些脚本属于 Astro 文档壳。这样做短期能跑，长期一定脆。

这里用正则不是为了“通用解析 HTML”，而是因为 `<lp-app>` 本身就是我们自己定义的交付协议节点。既然边界是我们自己规定的，用最直接的方式把它抽出来就够了。

### 第二步：主站消费的不是一段 HTML，而是一组必须一起交付的运行时材料

很多人第一次做这类集成时，最自然的误解是：只要把最终的 DOM 拿出来，主站就算接入成功了。

这正是问题所在。

Astro 页面里如果有 `client:visible`、`client:load` 这种 Island，真正让它在浏览器里继续工作的，不只有 HTML，还有 Astro 注入到产物里的脚本和样式。少任何一块，页面都可能变成“静态截图”。

所以在 `build:done` 里，这段代码做的不是简单字符串裁剪，而是把产物拆成几类有明确职责的内容：

```ts
const $ = cheerio.load(originHtml)

const scriptNotModuleTags = $('script:not([type="module"])')
const moduleScriptTags = $('script[type="module"]')
const styleTags = $('style')

let astroIslandContent = ''
scriptNotModuleTags.each((_, elem) => {
	astroIslandContent += `${$(elem).html()};`
})

let moduleScriptContent = ''
moduleScriptTags.each((_, elem) => {
	moduleScriptContent += `${$(elem).html()};`
})

let stylesContent = ''
styleTags.each((_, elem) => {
	stylesContent += $(elem).html()
})
```

这里真正要建立的心智模型是：**Astro 编译产物不是一个 HTML 文件，而是一组协同运行的前端资产。**

- `<lp-app>` 负责提供静态结构。
- `<style>` 负责让结构看起来正确。
- 非 `module` 脚本里包含 Island 运行时和初始化逻辑。
- `module` 脚本在某些平台下仍然参与客户端激活。

这也是为什么主站集成时，不能只做 DOM 注入。你必须把这些材料按正确的方式带过去，Astro 的客户端能力才不会在接入那一刻被“裁掉”。

### 第三步：Astro 只解决页面生成，宿主初始化要额外补一层

即便你把 Astro 自己的 HTML、样式、脚本都保留下来了，事情还是没有结束。

因为在真实项目里，页面进入主站之后，通常还要先接一层宿主环境的初始化：比如 rem / flexible 方案、全局配置注入、页面卸载时的清理逻辑，或者主站自己的生命周期桥接。

这段代码没有把这部分逻辑散落在业务组件里，而是把它抽成了平台相关的入口代码：

```ts
function getEntryCodeByPlatform(platform: LpPlatform) {
	if (platform === 'vivaia') {
		return js`
      import { flexible } from '@lp/flexible';
      import { initLpConfig, initAstroApp } from '@lp/utils';

      const unmountFns = initLpConfig();
      unmountFns.push(
        flexible({
          layouts: [375, 1920],
          breakpoints: [768],
          immediate: true,
          scope: {
            element: document.documentElement,
            cssVarName: '--lr',
          },
        }),
      );

      initAstroApp();
    `
	}
}
```

然后在 `build:done` 阶段，再用 `esbuild` 把这段入口代码编译成最终可以内联执行的脚本：

```ts
const entryBuildResult = await build({
	stdin: {
		contents: entryCode,
		resolveDir: process.cwd(),
		sourcefile: 'flexible-entry.ts',
	},
	bundle: true,
	write: false,
	minify: true,
	format: 'esm',
	platform: 'browser',
	target: ['safari15'],
	splitting: false,
	define: {
		'import.meta.env.NON_MAIN_SITE': `${!isMainSite}`,
	},
})
```

这里的关键不是“再编译一次”，而是**给 Astro 产物补一层宿主适配器**。

Astro 负责回答“页面是什么”；这层入口脚本负责回答“页面进入主站后先做什么”。如果把这两类职责混在一起，业务组件就会越来越依赖宿主环境，最后很难复用到别的平台。

### 第四步：真正敏感的不是拼接本身，而是重组后的执行顺序

到这一步，手里已经有了四样东西：

- `lpAppHTML`
- `stylesContent`
- `astroIslandContent`
- `entryBuildContent`

但还不能随便拼。这里最容易踩坑的地方，是脚本执行时序。

先看 `vivaia` 的处理：

```ts
const prefixMainAppScriptHTML = `<script>;${astroIslandContent};${entryBuildContent};</script>`
const stylesHTML = `<style>${stylesContent}</style>`

let content = `<lp-container>${prefixMainAppScriptHTML}${stylesHTML}${lpAppHTML}</lp-container>`

if (platform === 'vivaia') {
	await Promise.all(
		[
			fse.outputFile(indexPath, content, 'utf-8'),
			isMainSite &&
				fse.outputFile(
					path.join(distDir, '_preview.html'),
					htmlContent,
					'utf-8'
				),
		].filter(Boolean)
	)
}
```

这里输出的不是完整 HTML，而是一段片段化的 `lp-container`。因为 `vivaia` 这个场景里，真正负责输出文档壳的是主站 SSR，Astro 只需要把业务区和它依赖的启动材料交过去。

再看 `fanka`：

```ts
if (platform === 'fanka') {
	const htmlStr = html`<html>
		<body>
			<lp-container>
				<script>
					${entryBuildContent}
				</script>
				${stylesHTML} ${lpAppHTML}
				<script>
					${astroIslandContent}
				</script>
				<script type="module">
					${moduleScriptContent}
				</script>
			</lp-container>
		</body>
	</html>`
}
```

这个平台要的是整页 HTML，所以脚本和样式重新回到了完整文档中。

注意这里两个平台的差异，不是模板写法不同，而是**宿主执行环境不同**：

- 有的宿主需要的是一段可插入的业务片段。
- 有的宿主需要的是一份完整页面。
- 有的宿主已经有自己的客户端运行时，有的则需要把 Astro 的模块脚本完整带上。

所以“重组产物”这件事，本质上是在重新组织浏览器执行语义，而不是在拼字符串。

### 第五步：样式隔离不要放到接入时补救，而要放到构建期解决

把 Astro 页面接进主站后，另一个高频问题是样式串扰。尤其是 `swiper` 这种第三方库，它的选择器很多是全局的。如果不做隔离，主站别的模块也可能被一起命中。

所以这段代码把样式隔离放到了 `astro:config:setup` 阶段：

```ts
VitePrefixSelectorPlugin({
  prefix: ':where(lp-app)',
  match(filePath) {
    const keyword = ['swiper'];
    return (
      filePath.includes('node_modules') &&
      keyword.some((kw) => filePath.includes(kw))
    );
  },
}),
```

这一步有两个关键点。

第一，它不是把所有样式都无脑前缀化，而是只处理确定会污染主站的第三方样式。这样做更稳，因为全量改写选择器虽然“看上去最保险”，但也更容易引入 specificity、覆盖顺序、甚至组件库内部依赖关系的问题。

第二，它把样式作用域直接锚定在 `<lp-app>` 上。前面定义的业务边界，到这里就不只是 HTML 边界了，也成了 CSS 边界。

当然，这个方案也有 trade-off：你需要维护一份待隔离的依赖清单。它不是零成本，但比起在主站接入层临时打补丁，这种成本更可控，也更容易排查。

### 这一节真正解决了什么，没解决什么

到这里，这套方案解决的是：**如何把 Astro 的默认整页产物，转换成主站可以稳定消费的 HTML 片段或完整页面，并且保住客户端激活链路。**

它解决了几件事：

- 给业务区定义了稳定边界。
- 把 Astro 的运行时材料拆分出来并重新组织。
- 为不同平台补上宿主初始化逻辑。
- 在构建期处理了样式隔离问题。

但它还没有彻底解决另一类问题：**这些产物里引用的静态资源路径，进入主站之后是否还能被正确访问。**

比如 `astro-island` 上的 `component-url`、`renderer-url`，以及样式里可能出现的资源地址，这些都属于“产物路径重写”问题。它和“产物结构重组”强相关，但不是同一个问题。前者决定页面能不能被主站消费，后者决定页面消费之后能不能真正跑起来。

## 如何处理Astro编译产物中的静态资源引用路径问题？

把 Astro 页面单独部署时，`./assets/_app.xxx.js` 这种相对路径通常不会出问题。但一旦你把编译产物当成 HTML 片段塞进 Nuxt / Next 这类 SSR 主站里，情况就变了：HTML 能显示出来，CSS 可能也没问题，偏偏 Vue Island 死活不水合。

这类问题最容易让人误判。你会觉得「Astro 明明已经把路径写进产物了，浏览器为什么找不到？」但真正决定结果的，不是 Astro 构建时把文件放在了哪里，而是水合发生时，`astro-island` 到底从哪里读取这些 URL。

这篇只回答一个具体问题：当 Astro 编译产物被嵌入到别的 SSR 宿主里时，为什么静态资源路径会失效，以及怎么用一层很小的运行时补丁把它修正回来。

### 先看现象：HTML 在，交互没了

假设 Astro 构建后产出这样一段 HTML：

```html
<astro-island
	component-url="./assets/_app.BXJsAGJH.js"
	renderer-url="./assets/client.DAeD31y9.js"
	props="{}"
	ssr
	client="visible"
></astro-island>
```

如果这份产物被独立部署在它自己的目录下，`./assets/...` 会相对于当前页面正常解析。

但如果主站把它作为一个片段注入到下面这个地址：

```txt
https://www.example.com/activity/spring-sale
```

而你真正的静态资源却在：

```txt
https://cdn.example.com/static-lp/spring-sale/assets/_app.BXJsAGJH.js
```

浏览器最终很可能会去请求：

```txt
https://www.example.com/activity/assets/_app.BXJsAGJH.js
```

结果就是 404。页面里 SSR 出来的 HTML 还在，所以乍一看像是“能展示”；但一旦 Island 对应的 `component-url`、`renderer-url` 加载失败，后面的 Vue hydration 就根本不会继续。

到这里，其实问题已经暴露出来了：这不是 Astro 的水合逻辑坏了，而是它要加载的依赖地址已经不对了。

### 先给结论：有两类解法，但适用边界不同

这个问题不是只有一种解。

如果你的部署目标从一开始就是固定的，优先用 Astro 官方配置解决：

- `base`：适合站点部署在固定子路径下，例如 `/blog`、`/activity/spring-sale`
- `build.assetsPrefix`：适合页面和静态资源分开部署，资源统一走 CDN

但如果你的约束是另一类：同一份 Astro 产物要被多个宿主复用，真实资源前缀要到运行时才知道，甚至某些环境根本不走静态目录而是走 Blob URL，那只靠构建期配置就不够了。这时更稳妥的做法，是在 `astro-island` 读取 URL 属性的那一刻动态改写。

后面这段代码，解决的就是第二类问题。

### 为什么直觉会错：失效的不是“文件路径”，而是“读取时机”

很多人第一次遇到这个问题时，会默认认为：

1. Astro 构建时已经把相对路径写进 HTML 了
2. 浏览器拿到 HTML 后自然会知道这些路径该去哪里找

这个直觉并不完全错，但它忽略了一个关键前提：这份 HTML 已经不再以 Astro 原本的页面形态存在了，而是被主站当成一个片段重新消费。

对这套集成方案来说，普通的 `<link>`、`<script>`、`<style>` 很多已经在构建后被抽取和重组。真正决定 Island 能不能继续工作的，是 `astro-island` 上的几个属性值：

- `component-url`
- `renderer-url`
- `hydration-url`
- `before-hydration-url`

Astro runtime 在客户端水合时，会通过 `getAttribute()` 去读取这些字段。也就是说，真正需要被修正的，不是“HTML 看起来像不像对的”，而是 Astro runtime 读到的值是不是宿主环境里真正可访问的地址。

一旦你换成这个视角，这件事就很好解释了：路径问题本质上是宿主适配问题，不是模板问题。

### 官方配置什么时候够用

先说结论：如果资源地址在构建时就能确定，别急着上运行时补丁，直接用 Astro 官方能力更简单。

例如部署在固定子路径下：

```ts
import { defineConfig } from 'astro/config'

export default defineConfig({
	base: '/activity/spring-sale',
})
```

或者静态资源统一发布到 CDN：

```ts
import { defineConfig } from 'astro/config'

export default defineConfig({
	build: {
		assetsPrefix: 'https://cdn.example.com',
	},
})
```

这两种方式的优点很明显：

- 配置简单
- 和 Astro 官方语义一致
- 不需要额外侵入 runtime

但它也有很明确的边界：它要求你的部署形态在 build 时就是确定的。

如果你面对的是下面这些场景，它就不够用了：

- 同一份产物要同时给 Nuxt 主站、独立预览页、沙箱环境使用
- 不同平台有不同 CDN 前缀
- 资源地址要依赖宿主返回的数据动态决定
- 某些环境根本不从静态目录取文件，而是先拿代码文本再转 Blob URL

这也是为什么本文没有停在 `base` 或 `assetsPrefix`，而是往下走到了运行时补丁。

### 关键点不在改 HTML，而在改 `astro-island` 读取 URL 的方式

先看核心代码：

```ts
const ASTRO_ISLAND_PATCH_SYMBOL = Symbol('astro-island-patch')

export const AstroIslandUrlKeys = [
	'component-url',
	'renderer-url',
	'hydration-url',
	'before-hydration-url',
]

export async function initAstroApp() {
	let AstroIsland = customElements.get('astro-island')
	if (!AstroIsland) {
		await customElements.whenDefined('astro-island')
		AstroIsland = customElements.get('astro-island')
	}

	if (!(AstroIsland as any)[ASTRO_ISLAND_PATCH_SYMBOL]) {
		const originalGetAttribute = HTMLElement.prototype.getAttribute

		AstroIsland!.prototype.getAttribute = function (name: string) {
			const prefix = window.__lpConfig__?.prefix
			const value = originalGetAttribute.call(this, name)

			if (
				AstroIslandUrlKeys.includes(name) &&
				typeof value === 'string' &&
				value
			) {
				if (import.meta.env.NON_MAIN_SITE) {
					return window.__lpConfig__.codeMap?.[value]
				}

				if (prefix && !value.startsWith(prefix)) {
					return `${prefix}${value}`
				}
			}

			return value
		}
		;(AstroIsland as any)[ASTRO_ISLAND_PATCH_SYMBOL] = true
	}
}
```

这段代码最值得注意的地方在于：它没有去批量改写 DOM，也没有在构建阶段把所有路径直接替换掉，而是在 `astro-island` 读取属性值的那一刻做了一层拦截。

也就是说，HTML 里保留的仍然是 Astro 原始产物：

```html
component-url="./assets/_app.BXJsAGJH.js"
```

但当 Astro runtime 真正执行到：

```ts
this.getAttribute('component-url')
```

它拿到的已经不是原始值，而是宿主适配后的结果。这个思路很像把“路径翻译”从构建阶段推迟到了消费阶段。好处是同一份产物可以被多个宿主复用，宿主只需要在运行时告诉这段代码：资源到底应该从哪里拿。

### 这层补丁具体解决了什么

#### 1. 它只拦截 Astro hydration 真正依赖的字段

`AstroIslandUrlKeys` 只包含 4 个 URL 属性。这一点很重要。

如果你直接改 `HTMLElement.prototype.getAttribute`，或者不加限制地拦截所有属性，副作用会很大；但只拦截 `astro-island` 的关键 URL 字段，范围就足够小，也更容易排查问题。

这不是“尽量少写代码”，而是在工程里尽量减少影响面。

#### 2. 它等待 `astro-island` 注册完成后再补丁

这件事最容易忽略的地方在于执行时机。

`astro-island` 是 Astro runtime 注册的自定义元素。如果宿主入口脚本先执行，而 Astro runtime 还没把这个元素定义出来，你直接去改原型，改不到任何东西。所以这里先做了：

```ts
await customElements.whenDefined('astro-island')
```

这一步不是形式上的“保险”，而是保证补丁一定能落在正确对象上。

#### 3. 它用 `Symbol` 保证补丁只打一遍

主站里这种落地页片段往往不是一次性页面。它可能被：

- 多次进入同一路由
- 通过客户端导航反复挂载
- 在局部容器里卸载再重建

如果每次初始化都重新覆盖一次 `getAttribute()`，最常见的结果就是重复拼接前缀，例如：

```txt
https://cdn.example.com/https://cdn.example.com/./assets/_app.js
```

`ASTRO_ISLAND_PATCH_SYMBOL` 的作用就是给当前构造函数打一个标记，确保这层 patch 只生效一次。

#### 4. 在主站模式下，路径前缀由宿主运行时决定

主站场景下最关键的是这行：

```ts
const prefix = window.__lpConfig__?.prefix
```

这里的 `prefix` 不是 Astro 构建时写死的，而是宿主在运行时注入的。例如：

- `https://cdn.example.com/static-lp/activity/`
- `/static-lp/test/20260311/`

这样当 `astro-island` 读取到 `./assets/_app.xxx.js` 时，补丁就能把它翻译成宿主环境里的真实地址。

这件事的工程价值很大：你不需要因为 CDN 域名、投放路径、平台差异变化，就重新产出一份新的 Astro build。真正变化的只有宿主配置。

#### 5. 在非主站模式下，资源甚至可以不走静态目录

还有一个很有意思的分支：

```ts
if (import.meta.env.NON_MAIN_SITE) {
	return window.__lpConfig__.codeMap?.[value]
}
```

这意味着某些环境下，`component-url` 最终返回的并不是常规的 HTTP 地址，而是 `codeMap` 里的 Blob URL。

也就是说，宿主可以先把代码文本拉下来，再转成 `blob:` 地址喂给 `astro-island`。对浏览器来说，它仍然拿到了一个可执行的模块 URL；但对接入系统来说，它已经彻底摆脱了“当前页面必须和静态资源目录保持某种相对位置关系”这个限制。

这种做法很适合：

- 独立预览页
- 沙箱环境
- 需要鉴权或签名的资源分发链路

当然，它也不是没有代价：Blob URL 的缓存策略、调试体验、内存占用，都和普通静态文件不同。所以它更像是“高自由度方案”，不是默认首选方案。

### 为什么这里改的是 `getAttribute()`，不是直接改 DOM

你当然可以在 HTML 插入宿主页面之前，先把所有 `component-url`、`renderer-url` 批量改写掉。这么做的确也能工作。

但这里选择拦截 `getAttribute()`，本质上是在做一件更稳的事：把宿主差异收敛到 Astro runtime 真正消费这些值的那一刻。

这样做有几个直接好处：

1. 原始编译产物保持不变，便于复用和排查
2. 同一份 HTML 片段可以服务多个宿主，不需要提前写死路径
3. 宿主可以在最后一刻决定是走 CDN 前缀还是 Blob URL

但 trade-off 也要说清楚：

- 它依赖 Astro runtime 当前仍然通过 `getAttribute()` 读取这些值
- 它要求宿主初始化时机足够靠前，至少要在真正 hydration 前完成 patch
- `prefix` 本身最好做一次规范化，否则容易出现斜杠或 `./` 拼接不一致的问题

这不是一个“比官方配置更高级”的方案，它只是更适合运行时差异很大的集成场景。

### 配套的生命周期为什么也要一起设计

路径改好了，还不够。因为嵌入到主站之后，这段 Astro 片段已经不是一次性静态 HTML，而是一个会被挂载、卸载、再次进入的运行单元。

这也是为什么代码里还有 `initLpConfig()` 和 `lp-container`：

- `initLpConfig()` 负责初始化 `window.__lpConfig__`，给宿主留出统一配置入口
- `lp-container` 在 `disconnectedCallback()` 里执行 `unmountFns`，确保宿主移除片段时，内部 Vue 应用也能同步卸载

这两个点看起来和“路径修正”不是一回事，但放在真实工程里，它们其实属于同一个问题：当 Astro 产物不再是一个独立页面，而是宿主里的一个嵌入单元时，你就必须给它定义一套完整的宿主协议，包括资源定位、初始化和销毁。

### 这套方案适合什么，不适合什么

适合它的场景通常有这些特征：

- 一份 Astro 产物要服务多个平台
- 资源前缀要在运行时决定
- 主站本身已经有 SSR 外壳，不希望 Astro 重新接管整页
- 除了常规静态目录，还需要支持 Blob 或其他自定义加载方式

不太适合它的场景则很明确：

- 部署路径完全固定
- 只需要一个站点、一个资源域名
- 没有多宿主复用需求

这种情况下，直接用 Astro 的 `base` 或 `build.assetsPrefix`，实现会更简单，后续维护成本也更低。

### 调试时可以重点看哪些信号

这类问题其实很好定位，只要你盯住几个信号：

- 页面有 SSR 内容，但没有交互：优先怀疑 Island 依赖没加载成功
- Network 里请求到了当前页面目录下的 `./assets/...`：说明宿主前缀没有接管成功
- URL 被重复拼接：通常是 patch 重复执行，或者原值已经被改写过一次
- `astro-island` 还没定义就开始 patch：说明脚本执行顺序有问题
- 主站卸载片段后再次进入报错：说明资源路径也许没问题，但生命周期清理没做好

从排查效率上说，盯住 `component-url` 和 `renderer-url` 往往比盯 HTML 结构更有效，因为真正决定 hydration 能不能继续的，是这两个入口模块有没有被正确加载。

### 小结

处理 Astro 编译产物里的静态资源路径，最容易误解的地方在于：我们以为自己在处理“文件路径”，其实真正要处理的是“宿主在 hydration 时如何告诉 Astro 去哪里拿资源”。

如果部署目标固定，优先用 `base` 和 `build.assetsPrefix`，这是最省心的做法；但如果同一份产物要被多个 Nuxt / Next 宿主复用，资源前缀又必须到运行时才能确定，那么把适配逻辑收敛到 `astro-island` 的 URL 读取阶段，会更稳，也更符合这类集成问题的本质。

你真正要记住的不是某一个 API，而是这个心智模型：Astro 产物一旦离开它原本的部署目录，资源地址的所有权就从构建阶段转移到了宿主消费阶段。谁控制这个阶段，谁就应该负责把路径解释正确。

