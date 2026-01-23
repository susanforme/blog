---
title: CSS 奇技淫巧
description: 汇总一些实用的 CSS 技巧和解决方案
pubDate: 2025-11-11
tag:
  - css
sticky: 99
---

## 相对颜色

https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_relative_colors

使用相对颜色（relative color）可以让颜色值基于 CSS 变量动态调整，适应不同的主题或环境。

```css
.box {
	/* 旧浏览器读这行（纯色） */
	background-color: rgb(255, 0, 0);

	/* 新浏览器读这行（相对颜色），会覆盖上面的 */
	background-color: hsl(from var(--color) h s l);
}
```
