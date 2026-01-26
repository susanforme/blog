---
title: CSS兼容性问题
description: 浏览器CSS兼容性问题汇总,特别是Safari浏览器的元素定位等问题
pubDate: 2025-11-11
tag:
  - javascript
sticky: 99
---

```

Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,Fuck Safari,

```

## 元素定位问题

### 复现版本

`Safari 16.4`

~~2025年11月11日已经修复~~

| 项目             | Safari 行为                                                                                                          | Chrome 行为                                                                                                          | 影响说明                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **定位参照规则** | 绝对定位的伪类（如 `::before`, `::after`）会查找**最上层的显式 `position: relative` 元素**，以此作为宽高计算的参照。 | 绝对定位的伪类会查找**离自己最近的已定位（`relative` / `absolute` / `fixed` / `sticky`）父元素**，作为宽高计算参照。 | 造成 Safari 中伪类定位与预期不同，尤其是多层嵌套时。 |
| **层级解析方式** | 在渲染树中伪类被视为子级，但布局时其绝对定位参照会**回溯到顶层 relative 容器**。                                     | 在渲染树中伪类与普通元素一致，会**向上逐层查找最近定位父级**。                                                       | Safari 渲染更「全局化」，Chrome 渲染更「局部化」。   |
| **表现差异示例** | 当子元素有 `position: relative` 时，`::after` 的绝对定位仍参照祖先元素。                                             | 当子元素有 `position: relative` 时，`::after` 的绝对定位会参照该子元素。                                             | Safari 中视觉偏移、对齐错位。                        |

## transition 过渡动画问题

### 复现版本

`Safari 16.4`

在使用 `transition` 进行旋转动画时若 `<easing-function>`为ease ，则会出现来回抖动的问题。

```scss
.marker-container {
	--rotate-angle: 0deg;
	.wheel-track {
		transition: all 0.5s ease;
		transform: rotate(var(--rotate-angle));
	}
}
```

### 解决方案

将 `<easing-function>` 修改为 `linear` 即可解决该问题。

```scss
.marker-container {
	--rotate-angle: 0deg;
	.wheel-track {
		transition: all 0.5s linear;
		transform: rotate3d(0, 0, 1, var(--rotate-angle));
		will-change: transform;
	}
}
```
