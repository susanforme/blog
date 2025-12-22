---
title: React Hooks 简单理解
description: 深入理解React Hooks的状态记录机制,hook列表和fiber树的工作原理
pubDate: 2024-06-25
tag:
  - react
---

# React Hooks 简单理解

`react`用什么方式记录了`hooks`的状态？ 多个`react-hooks`用什么来记录每一个`hooks`的顺序的 ？ 换个问法！为什么不能条件语句中，声明`hooks`? `hooks`声明为什么在组件的最顶部？

React 在无状态组件中通过一个叫做 "hook 列表" 的机制来记录 hooks 的状态。每次组件渲染时，React 会按顺序依次调用 `useState`、`useEffect` 等 hook，并为每个 hook 分配一个内部位置索引来存储其状态。这个过程的关键是 **hooks 的顺序不变**，也就是说，每次渲染时，React 会保持相同的顺序来调用 hooks，从而确保每个 hook 都能够找到对应的状态。

具体来说，React 是通过 **内部的 fiber 树** 和 **hook 链表** 来管理这些状态。每个组件渲染时，React 会为其分配一个 fiber 对象，其中包含该组件的当前渲染状态（比如挂载的 hooks 的状态）。这些状态数据存储在 fiber 节点中，当组件更新时，React 会比较新旧 fiber，并通过 hooks 的顺序来判断哪些状态需要更新。

1. **每个 hook 对应一个索引位置**：当你调用 `useState` 时，React 会为该状态分配一个位置并记录这个位置。渲染时 React 会按顺序调用每个 hook，并用之前的位置保存对应的状态。
2. **内部的 hook 列表**：React 会为每个组件维护一个 "hook 列表" 来存储所有 hooks 的状态。每次组件重新渲染时，React 会基于索引来访问这些状态，确保每个 hook 都获取到正确的状态数据。
3. **fiber 树**：React 使用 fiber 数据结构来追踪组件的渲染过程，fiber 节点会存储每次渲染时的状态和其他重要信息。每次组件更新时，React 会通过 fiber 来查找和更新组件的状态。

简单来说，React 通过在内部维护一个与渲染过程相关的结构（fiber 树），并确保每个 hook 在每次渲染时都按照固定的顺序被调用，从而实现对 hook 状态的有效管理和更新。这种方式使得即使是无状态的函数组件，React 也能够在多次渲染之间保留其状态。

![链表定义与存储方式](https://raw.githubusercontent.com/susanforme/img/main/img/2025/02/28/14%E6%97%B657%E5%88%8653%E7%A7%9253088f3b0430b15650c8e63dcc38e862-linkedlist_definition-e198f4.png)
