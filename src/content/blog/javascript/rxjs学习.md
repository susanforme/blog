---
description: ts 装饰器
date: 2024-09-25
tag:
  - javascript
---

# rxjs

RxJS 是一个使用可观察序列编写异步和基于事件的程序的库。它提供了一种核心类型，即 Observable、一些周边类型（Observer、Scheduler、Subjects）和类似于 Array 方法（map、filter、reduce、every 等）的操作符，以便将异步事件作为集合进行处理。

## 基本概念

RxJS 中解决异步事件管理的基本概念有：

- **Observable（可观察者）**：表示未来（future）值或事件的可调用集合的概念。
- **Observer（观察者）**：是一个回调集合，它知道如何监听 Observable 传来的值。
- **Subscription（订阅）**：表示 Observable 的一次执行，主要用于取消执行。
- **Operator（操作符）**：是纯函数，可以使用 `map`、`filter`、`concat`、`reduce`
  等操作来以函数式编程风格处理集合。
- **Subject（主体）**：相当于一个 EventEmitter，也是将一个值或事件多播到多个 Observers 的唯一方式。
- **Scheduler（调度器）**：是控制并发的集中化调度器，允许我们在计算发生时进行协调，例如
  `setTimeout` 或 `requestAnimationFrame` 或其它。

## 特点

### 纯净

外部状态

```ts
let count = 0;
document.addEventListener('click', () =>
  console.log(`Clicked ${++count} times`),
);
```

状态隔离，链式调用

```ts
import { fromEvent, scan } from 'rxjs';

fromEvent(document, 'click')
  .pipe(scan((count) => count + 1, 0))
  .subscribe((count) => console.log(`Clicked ${count} times`));
```

### 流动

类似 linux 中的**管道**,用于将一个命令的输出传递给另一个命令作为输入

统计访问日志中出现最多的 IP

```shell
cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 1
```

处理用户输入，过滤关键词并去重

```ts
fromEvent(inputElement, 'input')
  .pipe(
    map((event) => event.target.value),
    filter((text) => text.length > 3),
    distinctUntilChanged(),
    debounceTime(300),
  )
  .subscribe((text) => {
    console.log('Filtered Input:', text);
  });
```

RxJS 有一系列的操作符，可以帮助你控制事件如何在你的 observables 中流动。

下面是使用纯 JavaScript 实现“最多允许每秒单击一次”的方式：

```ts
let count = 0;
let rate = 1000;
let lastClick = Date.now() - rate;
document.addEventListener('click', () => {
  if (Date.now() - lastClick >= rate) {
    console.log(`Clicked ${++count} times`);
    lastClick = Date.now();
  }
});
```

```ts
import { fromEvent, throttleTime, scan } from 'rxjs';

fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    scan((count) => count + 1, 0),
  )
  .subscribe((count) => console.log(`Clicked ${count} times`));
```

## 弹珠语法

在 TestScheduler 的上下文中，弹珠图是一个字符串，其中包含表示随着虚拟时间发生的事件的特殊语法。时间会按*帧*前进。任何弹珠字符串的第一个字符总是代表*零帧*或者说时间的起点。在
`testScheduler.run(callback)`
内部，frameTimeFactor 设置为 1，这意味着一帧等于一个虚拟毫秒。

一帧代表多少虚拟毫秒取决于 `TestScheduler.frameTimeFactor`
的值。由于遗留原因，*只有*当 `testScheduler.run(callback)`
回调中的代码正在运行时，`frameTimeFactor`
的值才为 1。在此之外，它设置为 10。这一点可能会在 RxJS 的未来版本中发生变化，以便让它始终为 1。

- `' '` 空白：忽略水平空白，可用于帮助垂直对齐多个弹珠图。

- `'-'` 帧：1 个虚拟时间流逝的“帧”（参见上面的帧描述）。

- `[0-9]+[ms|s|m]`
  时间进度：时间进度语法允许你将虚拟时间推进特定的数量。它是一个数字，后跟
  `ms`（毫秒）、`s`（秒）或 `m`（分钟）的时间单位，它们之间没有任何空格，例如
  `a 10ms b`。有关更多详细信息，请参阅[时间进度语法](https://rxjs.tech/guide/testing/marble-testing#time-progression-syntax)。

- `'|'` 完成：一个 Observable 的成功完成。这是 Observable 的生产者信号
  `complete()`。

- `'#'` 错误：终止 observable 的错误。这是 Observable 的生产者信号 `error()`。

- `[a-z0-9]`（例如 `'a'`）任何字母数字字符：表示由生产者信号 `next()`
  发出的值。你可以将它映射到一个对象或数组中，如下所示：

## 时间进展语法

`'-'` 或 `'------'` ：等价于
[`NEVER`](https://rxjs.tech/api/index/const/NEVER)，或者是一个“从不发出”、“错误”或“完成”的 Observable。

`|` : 等价于
[`EMPTY`](https://rxjs.tech/api/index/const/EMPTY)，或者是一个永远不会立即发出和完成的 observable。

`#` ：等价于
[`throwError`](https://rxjs.tech/api/index/function/throwError)，或者是一个永远不会立即发出错误的 Observable。

`'--a--'` ：一个等待 2 个“帧”的 Observable，在第 2 帧上发出值 `a`
然后永远不会完成。

`'--a--b--|'` ：在第 2 帧发出 `a`，在第 5 帧发出 `b`，在第 8 帧 `complete`。

`'--a--b--#'` ：在第 2 帧发出 `a`，在第 5 帧发出 `b`，在第 8 帧发出 `error`。

`'-a-^-b--|'` ：在一个热 observable 中，在 -2 帧上发出 `a`，然后在第 2 帧上发出
`b`，在第 5 帧上 `complete`。

`'--(abc)-|'` ：在第 2 帧发出 `a`、`b` 和 `c`，然后在第 8 帧，`complete`。

`'-----(a|)'` ：在第 5 帧发出 `a` 并 `complete`。

`'a 9ms b 9s c|'` ：在第 0 帧发出 `a`，在第 10 帧发出 `b`，在第 9,011 帧发出
`c`，然后在第 9,012 帧 `complete`。

`'--a 2.5m b'` ：在第 2 帧发出 `a`，在第 150,003 帧发出 `b` 并且永远不会完成。

## 常见操作符

### map

```ts
map(project: (value: T, index: number) => R): OperatorFunction<T, R>
```

![替代文本](https://rxjs.dev/assets/images/marble-diagrams/map.png)

```ts
import { fromEvent, map } from 'rxjs';

const clicks = fromEvent<PointerEvent>(document, 'click');
const positions = clicks.pipe(map((ev) => ev.clientX));

positions.subscribe((x) => console.log(x));
```

### switchMap

```ts
switchMap<T, R, O extends ObservableInput<any>>(project: (value: T, index: number) => O, resultSelector?: (outerValue: T, innerValue: ObservedValueOf<O>, outerIndex: number, innerIndex: number) => R): OperatorFunction<T, ObservedValueOf<O> | R>
```

![](https://rxjs.dev/assets/images/marble-diagrams/switchMap.png)

```ts
import { of, switchMap } from 'rxjs';

const switched = of(1, 2, 3).pipe(switchMap((x) => of(x, x ** 2, x ** 3)));
switched.subscribe((x) => console.log(x));
// outputs
// 1
// 1
// 1
// 2
// 4
// 8
// 3
// 9
// 27
```

### scan

```ts
scan<V, A, S>(accumulator: (acc: V | A | S, value: V, index: number) => A, seed?: S): OperatorFunction<V, V | A>
```

![替代文本](https://rxjs.dev/assets/images/marble-diagrams/scan.png)

```ts
import { of, scan, map } from 'rxjs';

const numbers$ = of(1, 2, 3);

numbers$.pipe(scan((total, n) => total + n)).subscribe(console.log);
```

### from

```ts
from(input: O): Observable<ObservedValueOf<O>>
```

![](https://rxjs.dev/assets/images/marble-diagrams/from.png)

```ts
import { from, take } from 'rxjs';

function* generateDoubles(seed) {
  let i = seed;
  while (true) {
    yield i;
    i = 2 * i;
  }
}

const iterator = generateDoubles(3);
// take 仅发送源 Observable 发出的前 count 个值。
const result = from(iterator).pipe(take(10));

result.subscribe((x) => console.log(x));

// Logs:
// 3
// 6
// 12
// 24
// 48
// 96
// 192
// 384
// 768
// 1536
```

### of

```ts
of<T>(...args: (SchedulerLike | T)[]): Observable<T>
```

![](https://rxjs.dev/assets/images/marble-diagrams/of.png)

```ts
import { of } from 'rxjs';

of(10, 20, 30).subscribe({
  next: (value) => console.log('next:', value),
  error: (err) => console.log('error:', err),
  complete: () => console.log('the end'),
});

// Outputs
// next: 10
// next: 20
// next: 30
```

### forkJoin

发出一个与传递的数组完全相同顺序的值数组，或者一个与传递的字典具有相同形状的值字典。

```ts
forkJoin(...args: any[]): Observable<any>
```

![](https://rxjs.dev/assets/images/marble-diagrams/forkJoin.png)

```ts
import { forkJoin, of, timer } from 'rxjs';

const observable = forkJoin({
  foo: of(1, 2, 3, 4),
  bar: Promise.resolve(8),
  baz: timer(4000),
});
observable.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('This is how it ends!'),
});

// Logs:
// { foo: 4, bar: 8, baz: 0 } after 4 seconds
// 'This is how it ends!' immediately after
```

### tap

```ts
tap(observerOrNext?: Partial<TapObserver<T>> | ((value: T) => void)): MonoTypeOperatorFunction<T>
```

![](https://rxjs.dev/assets/images/marble-diagrams/tap.png)

## 冷流和热流

**冷流**： 每个订阅者都会得到**独立的数据流**

**热流**： 数据**由一个源产生并共享**，多个订阅者接入时只能接收到那时之后的数据。

```ts
import { interval } from 'rxjs';
import { share } from 'rxjs/operators';

// 转为热流（共享一个生产者
const hot$ = interval(1000).pipe(share());

hot$.subscribe((val) => console.log('🔥 A:', val));

setTimeout(() => {
  hot$.subscribe((val) => console.log('🔥 B:', val));
}, 3000);
// 🔥 A: 0
// 🔥 A: 1
// 🔥 A: 2
// 🔥 A: 3
// 🔥 B: 3
// 🔥 A: 4
// 🔥 B: 4
// 🔥 A: 5
// 🔥 B: 5
```
