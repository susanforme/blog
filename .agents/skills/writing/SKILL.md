---
name: frontend-article-style
description: write frontend technical articles in a problem-driven, example-first, mechanism-explaining style. use when drafting or rewriting posts about javascript, css, react, performance, browser behavior, engineering trade-offs, debugging, or specific frontend technical problems. especially useful when the article should sound clear, concrete, teach through cases, and follow the writing patterns commonly seen in in-depth frontend blogs.
---

# Goal

Write frontend articles with a style that is:

- problem-driven, not topic-dump driven
- concrete, not slogan-heavy
- mechanism-first, not conclusion-first
- readable and layered, not academically dense
- honest about trade-offs, limits, and edge cases
- useful to engineers who came with a real question

Do **not** imitate any single author's wording or signature phrasing.
Instead, absorb the shared strengths behind the referenced blogs.

# Default article voice

Use these defaults unless the user asks otherwise:

- Write in **Chinese**
- Keep technical terms in English when that improves precision
- Tone: calm, confident, explanatory, not overhyped
- Prefer first-principles explanation over authority-based claims
- Prefer short-to-medium paragraphs
- Prefer meaningful subheadings
- Prefer examples early

# Core writing principles

## 1. Start from a specific problem

Open with a concrete problem, bug, misunderstanding, or engineering tension.

Good openings:

- 为什么 `height: 100%` 有时候完全不生效？
- 为什么 React 里这个请求会重复发送两次？
- 为什么你明明做了代码分割，首屏还是慢？
- 为什么 `position: sticky` 看起来“失效”了？
- 为什么 `useEffect` 明明依赖写全了，还是有 stale closure？

Avoid vague openings like:

- 今天我们来介绍……
- 前端性能非常重要……
- React 是一个流行框架……

The reader should feel:
"这就是我遇到过的问题。"

## 2. Give the answer shape before full detail

Early in the article, briefly tell the reader what kind of thing is happening:

- 是布局规则导致的
- 是渲染时机导致的
- 是浏览器默认行为导致的
- 是缓存模型导致的
- 是心智模型出了偏差

Do not fully dump the conclusion yet.
Give the reader a map, then walk through it.

## 3. Explain by building intuition, not just listing rules

When possible, explain in this order:

1. What the developer expected
2. What actually happened
3. Why that expectation was reasonable
4. Which underlying rule breaks that expectation
5. How to think about it correctly

Prefer phrases like:

- 这件事最容易误解的地方在于……
- 乍一看你会以为……
- 真正决定结果的不是 X，而是 Y
- 这里不是“失效”，而是规则根本没有满足
- 一旦你换成这个视角，这个现象就很好解释了

## 4. Always use a running example

Do not talk in pure abstraction for too long.

Every major section should include one or more of:

- a tiny code snippet
- a minimal failing example
- a before/after comparison
- a scenario from real work
- a mental model analogy

Use the smallest example that still demonstrates the point.

Bad:

- giant demo code
- full project files
- too many unrelated utilities

Good:

- 10 to 30 lines that isolate the issue

## 5. Teach the mechanism, then return to practice

For each topic, cover both:

- the mechanism
- the engineering consequence

Example pattern:

- 先解释浏览器为什么这样算
- 再解释这会在业务里导致什么坑
- 最后给出稳定写法

Avoid articles that only explain "how to fix" without explaining "why it breaks".

## 6. Include trade-offs and boundaries

For every recommended solution, mention:

- when it works well
- when it becomes awkward
- performance cost
- readability cost
- browser/framework constraints
- when another solution is better

Never present a trick as universally best.

Use language like:

- 这个方案适合……
- 但如果你的约束是……，那它就未必合适
- 这不是错，只是 trade-off 不同
- 这里追求的是稳定性，不是最少代码
- 从 demo 角度它很漂亮，但工程里要补上……

## 7. Write like a guide, not a documentation generator

Do not mechanically enumerate APIs.

Instead of:

- definition
- syntax
- options
- return value

Prefer:

- what problem forces us to care about this
- what developers usually misunderstand
- what the runtime/browser/framework is actually doing
- how to choose between options

## 8. Respect reader cognition

Assume the reader is smart but busy.

So:

- introduce one idea at a time
- do not stack 4 new concepts in one paragraph
- avoid unexplained jargon
- when using jargon, define it in plain language first
- summarize before moving on

Useful transition patterns:

- 先别急着记结论，我们先看现象
- 到这里，其实问题已经暴露出来了
- 现在我们把现象和规则对上
- 这也是为什么……
- 有了这个前提，再看解决方案就自然了

## 9. Prefer "show -> explain -> refine"

Default flow inside a section:

1. Show the phenomenon
2. Explain the hidden rule
3. Refine the reader's mental model
4. Offer a practical strategy

This is better than:

1. abstract theory
2. more theory
3. finally one tiny example

## 10. End with distilled takeaways

The ending should not just repeat the introduction.

Finish by compressing the article into a few durable ideas:

- what matters
- what to remember next time
- which signal to look for when debugging
- which mental model replaces the wrong one

# Recommended article structure

Use this as the default structure for most posts:

## 1. Problem hook

Use a concrete question, bug, or surprising result.

## 2. Reproduce the phenomenon

Show a minimal example.
Explain what most people expect.

## 3. Why the intuition breaks

Expose the wrong mental model.

## 4. The actual mechanism

Explain the browser / React / JavaScript / CSS / network / build rule.

## 5. Practical solutions

Provide 2 to 4 options.
Explain trade-offs.
Do not list redundant variants.

## 6. Edge cases and debugging signals

Mention common exceptions, false positives, or related traps.

## 7. Summary

Compress into memorable rules.

# Style constraints

## Must do

- Use clear section titles
- Use concrete examples
- Use code when it genuinely clarifies
- Prefer "one article = one core question"
- Explain why, not just what
- Mention trade-offs
- Keep the piece teachable and searchable
- Make the title specific

## Must not do

- Do not write clickbait
- Do not inflate with generic industry talk
- Do not imitate a specific author's signature wording
- Do not overuse metaphors
- Do not dump huge code blocks without narration
- Do not hide assumptions
- Do not pretend a solution is universal
- Do not end with empty encouragement like "希望对你有帮助"

# Title patterns

Prefer titles that expose a concrete tension.

Good patterns:

- 为什么……
- ……到底是怎么回事
- ……失效的真正原因
- 当你以为是 X，其实是 Y
- 从一个真实问题讲清楚……
- ……的常见误区与正确心智模型
- 别急着用……，先搞清楚……

Avoid titles that are too broad:

- 深入理解前端
- React 完全指南
- CSS 从入门到精通

# Output modes

When asked to write, choose one of these modes.

## Mode A: Full article

Use for direct requests like:

- 写一篇文章
- 帮我起草博客
- 展开讲讲这个问题

Output:

- title
- introduction
- main sections
- summary

## Mode B: Article outline

Use for requests like:

- 给我一个写作提纲
- 我想写这个主题怎么展开

Output:

- 3 to 7 section outline
- for each section: core question + example + key conclusion

## Mode C: Rewrite existing draft

When rewriting a draft:

1. preserve the technical meaning
2. make the hook more concrete
3. reduce generic filler
4. insert examples where missing
5. strengthen explanation of mechanism
6. add trade-offs if absent
7. make the ending more memorable

# Topic-specific guidance

## For CSS articles

Emphasize:

- formatting context
- containing block
- stacking context
- layout constraints
- intrinsic sizing
- browser calculation rules

When discussing a CSS issue, explicitly answer:
"Which rule actually determines the outcome?"

## For React articles

Emphasize:

- render vs commit
- state snapshots
- closures
- dependency semantics
- cache ownership
- server/client boundaries
- synchronization vs derivation

When discussing a React issue, explicitly answer:
"What data flow or lifecycle assumption was wrong?"

## For JavaScript articles

Emphasize:

- execution model
- closure capture
- reference vs value behavior
- event loop and task ordering
- prototype / object model when relevant

When discussing a JavaScript issue, explicitly answer:
"Which runtime behavior created the surprise?"

## For performance articles

Emphasize:

- what is measured
- where time is spent
- whether the bottleneck is network / parse / execute / render / layout / memory
- user-visible impact
- trade-off between complexity and gain

Avoid writing performance advice as superstition.

# Rewrite prompt behavior

If the user gives a topic only, first produce:

1. a candidate title
2. a one-paragraph thesis
3. a detailed outline
4. then the full article

If the user gives a rough draft, transform it into a cleaner article using this skill's style.

If the user asks for "more like those blogs", increase:

- concreteness
- explanatory layering
- example density
- mental-model correction
- practical debugging guidance

# Self-check before finalizing

Before returning an article, silently check:

- Is the opening anchored in a specific problem?
- Is there at least one concrete example early?
- Did I explain the mechanism, not just the fix?
- Did I mention trade-offs or limits?
- Could a reader use this to debug a real issue?
- Does the title describe a real question?
- Did I avoid sounding like generated documentation?

If any answer is no, revise before final output.
