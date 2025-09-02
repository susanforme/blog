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
/demo/web-components.html
```

## Shadow DOM 基础

自定义元素的一个重要方面是封装，因为自定义元素从定义上来说是一种可重用功能：它可以被放置在任何网页中，并且期望它能够正常工作。因此，很重要的一点是，运行在页面中的代码不应该能够通过修改自定义元素的内部实现而意外地破坏它。Shadow
DOM 允许你将一个 DOM 树附加到一个元素上，并且使该树的内部对于在页面中运行的 JavaScript 和 CSS 是隐藏的。

一个 DOM 元素可以有以下两类 DOM 子树：

1. Light tree
   —— 一个常规 DOM 子树，由 HTML 子元素组成。我们在之前章节看到的所有子树都是直接可见。
2. Shadow tree —— 一个隐藏的 DOM 子树，不在 HTML 中反映，无法被察觉。

如果一个元素同时有以上两种子树，那么浏览器只渲染 shadow tree。

**见最简示例**

### 渲染

![shadow](./img/shadow-dom.png)

### 封装

可以看到Shadow DOM 被非常明显地和主文档分开：

1. Shadow DOM 元素对于 light DOM 中的 `querySelector` 不可见。
2. Shadow DOM 有自己的样式。外部样式规则在 shadow DOM 中不产生作用。
3. CSS变量能够从Light DOM传递到Shadow DOM。方便了样式的定制。

```html-box
<style>
body{
  --b-r: 10px;
}
p{
  color: blue;
}
p{
  background: yellow !important;
}
</style>
<body>
 <p>Hello Light DOM!</p>
</body>
<script>
const element = document.createElement('div');
const shadowRoot = element.attachShadow({ mode: 'open' });
shadowRoot.innerHTML = `
  <style>
  p{
    color: red;
    border-radius: var(--b-r,0);
    background: green;
  }
  </style>
  <p id="shadow">Hello, Shadow DOM!</p>
`;
document.body.appendChild(element);
console.log("是否能查到内部的元素",document.querySelector('#shadow'));
</script>
```

## Shadow DOM 事件

Shadow tree 背后的思想是封装组件的内部实现细节。

假设，在 `<user-card>` 组件的 shadow
DOM 内触发一个点击事件。但是主文档内部的脚本并不了解 shadow
DOM 内部，尤其是当组件来自于第三方库。

所以，为了保持细节简单，浏览器会重新定位（retarget）事件。

来看如下例子

![event](./img//shadow/button.png)

```html-box
<user-card></user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<p>
      <button>Click me</button>
    </p>`;
    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

document.onclick =
  e => alert("Outer target: " + e.target.tagName);
</script>
```

如果你点击了 button，就会出现以下信息：

1. Inner target: `BUTTON` —— 内部事件处理程序获取了正确的目标，即 shadow
   DOM 中的元素。
2. Outer target: `USER-CARD` —— 文档事件处理程序以 shadow host 作为目标。

事件重定向是一件很棒的事情，因为外部文档并不需要知道组件的内部情况。从它的角度来看，事件是发生在
`<user-card>`。

**如果事件发生在 slotted 元素上，实际存在于 light
DOM 上，则不会发生重定向。(如果学习过Vue，应该知道Vue的插槽原理，slot 元素实际存在于父组件上，所有的事件绑定等处理都是在父组件中进行的)**

例如，在下面的例子中，如果用户点击了
`<span slot="username">`，那么对于 shadow 和 light 处理程序来说，事件目标就是当前这个
`span` 元素。

```xml
<user-card id="userCard">
  #shadow-root
    <div>
      <b>Name:</b>
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
</user-card>
```

```html-box
<user-card id="userCard">
  <span slot="username">John Smith</span>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div>
      <b>Name:</b> <slot name="username"></slot>
    </div>`;

    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

userCard.onclick = e => alert(`Outer target: ${e.target.tagName}`);
</script>

```

### event.composedPath()

使用 event.composedPath() 获得原始事件目标的完整路径以及所有 shadow 元素。正如我们从方法名称中看到的那样，该路径是在组合（composition）之后获取的。

因此，对于 `<span slot="username">` 上的点击事件，会调用 `event.composedPath()`
并返回一个数组：[`span`, `slot`, `div`, `shadow-root`, `user-card`, `body`,
`html`, `document`, `window`]。在组合之后，这正是扁平 DOM 中目标元素的父链。

> **Shadow 树详细信息仅提供给 `{mode:'open'}` 树**
>
> 如果 shadow 树是用 `{mode: 'closed'}`
> 创建的，那么组合路径就从 host 开始：`user-card` 及其更上层。
>
> 这与使用 shadow DOM 的其他方法的原理类似。closed 树内部是完全隐藏的。

### event.composed

大多数事件能成功冒泡到 shadow DOM 边界。很少有事件不能冒泡到 shadow DOM 边界。

这由 `composed` 事件对象属性控制。如果 `composed` 是
`true`，那么事件就能穿过边界。否则它仅能在 shadow DOM 内部捕获。

如果你浏览一下 [UI 事件规范](https://www.w3.org/TR/uievents)
就知道，大部分事件都是 `composed: true`：

- `blur`，`focus`，`focusin`，`focusout`，
- `click`，`dblclick`，
- `mousedown`，`mouseup` `mousemove`，`mouseout`，`mouseover`，
- `wheel`，
- `beforeinput`，`input`，`keydown`，`keyup`。

所有触摸事件（touch events）及指针事件（pointer events）都是 `composed: true`。

但也有些事件是 `composed: false` 的：

- `mouseenter`，`mouseleave`（它们根本不会冒泡），
- `load`，`unload`，`abort`，`error`，
- `select`，
- `slotchange`。

这些事件仅能在事件目标所在的同一 DOM 中的元素上捕获，

## 总结

Shadow DOM ：

- 有自己的 id 空间。
- 对主文档的 JavaScript 选择器隐身，比如 `querySelector`。
- 只使用 shadow tree 内部的样式，不使用主文档的样式。
