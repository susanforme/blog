---
date: 2025-09-01
tag:
  - javascript
  - vue
  - css
---

# Vue 渲染隔离：在 Shadow DOM 内挂载编译产物

## 引言

- 为什么需要Shadow DOM？
  - 样式污染问题（全局 CSS 冲突、第三方组件样式覆盖）。
  - 多应用/微前端场景下的 DOM 污染风险。
  - 性能对比iframe：Shadow DOM 更轻量，性能更好。
- Shadow DOM 的优势：样式封闭性、DOM 隔离性、事件机制。
- 本文目标：在 Shadow DOM 中挂载 Vue 编译产物，避免污染外部环境。

## Web Components

Web 组件的一个关键特性是创建自定义元素：即由 Web 开发人员定义行为的 HTML 元素，扩展了浏览器中可用的元素集。

```iframe
/blog/demo/web-components.html
```

## Shadow DOM 基础

自定义元素的一个重要方面是封装，因为自定义元素从定义上来说是一种可重用功能：它可以被放置在任何网页中，并且期望它能够正常工作。因此，很重要的一点是，运行在页面中的代码不应该能够通过修改自定义元素的内部实现而意外地破坏它。影子 DOM（Shadow
DOM）允许你将一个 DOM 树附加到一个元素上，并且使该树的内部对于在页面中运行的 JavaScript 和 CSS 是隐藏的。

**见最简示例**

```javascript
const element = document.createElement('div');
const shadowRoot = element.attachShadow({ mode: 'open' });
shadowRoot.innerHTML = '<style>p{color: red;}</style><p>Hello, Shadow DOM!</p>';
document.body.appendChild(element);
```

```html-box
<body>
 <p>Hello Light DOM!</p>
</body>
<script>
const element = document.createElement('div');
const shadowRoot = element.attachShadow({ mode: 'open' });
shadowRoot.innerHTML = '<style>p{color: red;}</style><p>Hello, Shadow DOM!</p>';
document.body.appendChild(element);
</script>
```

- 什么是 Shadow Root。
- `attachShadow` 的工作方式。
- 样式隔离机制（继承、穿透、`:host`、`::slotted`）。

### Shadow tree

一个 DOM 元素可以有以下两类 DOM 子树：

1. Light tree
   —— 一个常规 DOM 子树，由 HTML 子元素组成。我们在之前章节看到的所有子树都是直接可见。
2. Shadow tree —— 一个隐藏的 DOM 子树，不在 HTML 中反映，无法被察觉。

## 三、方案设计思路

- Vue 挂载点替换为 Shadow Root。
- 将 Vue 编译产物插入到 Shadow Root 内。
- 样式文件的注入问题（CSS 注入到 Shadow Root 而不是全局）。

## 引言

- **背景：**
  解释为什么在复杂的应用或微前端架构中，需要对不同的模块或组件进行渲染隔离。
- **问题：**
  传统的 Vue 挂载方式会污染全局样式和 DOM 环境，导致样式冲突和意外的副作用。
- **解决方案：** 引入 Shadow
  DOM，利用其封装性，为 Vue 应用提供一个独立的、隔离的渲染环境。
- **本文目标：** 深入探讨如何将 Vue 编译产物（如
  `App.vue`）安全、有效地挂载到 Shadow DOM 内部，实现真正的样式和 DOM 隔离。

## 认识 Shadow DOM

- **什么是 Shadow DOM？** 简要介绍其定义和核心概念（Shadow Root, Shadow Tree,
  Host）。
- **Shadow DOM 的优势：** 阐述其在样式隔离、DOM 结构封装和组件化方面的优点。
- **Shadow DOM 的局限性：** 提及可能遇到的问题，如外部样式、事件冒泡等。

## 在 Shadow DOM 内挂载 Vue 应用的基础原理

- **常规 Vue 挂载流程：** 回顾 `createApp().mount('#app')` 的工作原理。
- **核心挑战：** Vue 的 `mount` 方法需要一个真实的 DOM 元素作为挂载点。Shadow
  Root 作为宿主的子节点，可以作为这个挂载点。
- **基本步骤概述：**
  1.  创建一个宿主 DOM 元素。
  2.  为该宿主元素创建并附加一个 Shadow Root。
  3.  将 Vue 应用挂载到这个 Shadow Root 上。

## 实践：详细的挂载步骤与代码示例

- **步骤一：创建宿主元素与 Shadow Root**
  - 代码示例：如何使用 `document.createElement` 和
    `attachShadow({ mode: 'open' })`。
  - 解释 `mode: 'open'` 的作用。
- **步骤二：处理样式隔离**
  - **内联 `<style>` 标签：** 直接在 Shadow Root 中插入 `<style>`
    标签来引入样式。
  - **通过 `<link>` 标签引入 CSS 文件：** 讲解如何动态创建 `<link>`
    标签并添加到 Shadow Root。
  - **构建工具的集成：**
    以 Vite 或 Webpack 为例，说明如何配置打包工具，将 CSS 注入到 JavaScript 包或作为单独的 CSS 文件处理。
- **步骤三：挂载 Vue 实例**
  - 代码示例：展示如何使用 `createApp()` 并将 Shadow Root 作为挂载目标。
  - 对比传统挂载方式，突出其不同之处。

---

## 高级主题与注意事项

- **全局依赖和插件：** 讨论在隔离环境中如何处理 Vue Router、Vuex 等全局插件。
- **事件处理与通信：**
  - Shadow DOM 内的事件默认不会穿透边界。
  - 介绍如何使用 `Event.composedPath()`
    或自定义事件 (`CustomEvent`) 来进行父子组件通信。
- **性能考量：** 讨论在大量使用 Shadow DOM 时可能对性能产生的影响。
- **与微前端框架的结合：** 以 Qiankun 或 Module
  Federation 为例，简要说明这种方法在微前端中的应用场景和优势。

## 总结

- **核心优势：** 重申在 Shadow
  DOM 内挂载 Vue 应用所带来的渲染隔离、样式封装和组件独立性。
- **适用场景：**
  总结这种技术特别适合微前端、第三方组件库或需要高度隔离的复杂应用。
- **展望：** 简要提及未来的发展方向或相关技术。
