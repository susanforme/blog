---
description: ts 装饰器
date: 2024-09-25
tag:
  - javascript
---

# rxjs

RxJS 是一个使用可观察序列编写异步和基于事件的程序的库。它提供了一种核心类型，即
Observable、一些周边类型（Observer、Scheduler、Subjects）和类似于 Array 方法
（map、filter、reduce、every 等）的操作符，以便将异步事件作为集合进行处理。

## 基本概念

RxJS 中解决异步事件管理的基本概念有：

- **Observable（可观察者）**：表示未来（future）值或事件的可调用集合的概念。
- **Observer（观察者）**：是一个回调集合，它知道如何监听 Observable 传来的值。
- **Subscription（订阅）**：表示 Observable 的一次执行，主要用于取消执行。
- **Operator（操作符）**：是纯函数，可以使用 `map`、`filter`、`concat`、`reduce`
  等操作来以函数式编程风格处理集合。
- **Subject（主体）**：相当于一个 EventEmitter，也是将一个值或事件多播到多个
  Observers 的唯一方式。
- **Scheduler（调度器）**：是控制并发的集中化调度器，允许我们在计算发生时进行协
  调，例如 `setTimeout` 或 `requestAnimationFrame` 或其它。

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

发出一个与传递的数组完全相同顺序的值数组，或者一个与传递的字典具有相同形状的值字
典。

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

**热流**： 数据**由一个源产生并共享**，多个订阅者接入时只能接收到那时之后的数据
。

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
