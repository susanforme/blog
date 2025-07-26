---
date: 2020-12-20
tag:
  - typescript
---

# TypeScript

## 简介

### 什么是 TypeScript？

TypeScript 是由微软开发的自由和开源的编程语言。 它是 JavaScript 的一个超集，扩展
了 JavaScript 的语法，并添加了静态类型检查的功能。 这意味着任何有效的 JavaScript
代码也是有效的 TypeScript 代码。 TypeScript 的设计目标是开发大型应用，它可以编译
成纯 JavaScript，编译出来的 JavaScript 可以运行在任何浏览器、任何计算机和任何操
作系统上。

### TypeScript 的优势

TypeScript 主要有以下几个优势：

- **静态类型检查**：TypeScript 提供了编译时的静态类型检查，可以在编码阶段就发现
  潜在的错误，而不是在运行时。 这大大提高了代码的健壮性和可维护性。
- **更好的工具支持**：类型系统使得代码编辑器和 IDE 能够提供更智能的代码补全、导
  航和重构功能。
- **可读性和可维护性**：类型注解使得代码意图更加清晰，方便团队协作和长期维护。
- **拥抱最新标准**：TypeScript 支持最新的 ECMAScript 标准（如 ES6、ES7 等），并
  可以将其编译为向后兼容的 JavaScript 版本，让你提前使用最新的语言特性。
- **强大的生态系统**：TypeScript 拥有庞大的社区和丰富的生态系统，例如
  DefinitelyTyped 提供了成千上万个常用 JavaScript 库的类型定义文件。

### 与 JavaScript 的关系

TypeScript 与 JavaScript 之间存在着密切的关系。可以将其理解为：

- **TypeScript 是 JavaScript 的超集**：这意味着 TypeScript 完全包含了 JavaScript
  的所有语法和功能。你可以将已有的 `.js` 文件直接重命名为 `.ts` 文件，然后开始逐
  步添加类型注解，而无需重写整个代码库。
- **TypeScript 编译为 JavaScript**：TypeScript 代码最终会通过编译器转换为纯粹的
  JavaScript 代码。 你可以在任何支持 JavaScript 的环境中运行编译后的代码。
  TypeScript 只是在开发阶段为你提供了额外的类型安全保障。
- **TypeScript 弥补了 JavaScript 的不足**：JavaScript 是一门动态类型语言，在大型
  项目中容易出现类型相关的错误。 TypeScript 的出现正是为了解决这个问题，它为
  JavaScript 引入了静态类型系统，让开发者在享受 JavaScript 灵活性的同时，也能获
  得类型安全带来的好处。

## 基础类型

TypeScript 提供了一系列的基础数据类型，用于定义变量和函数参数的类型。

### 布尔值 (Boolean)

最基本的数据类型就是简单的 true/false 值，在 JavaScript 和 TypeScript 里叫做
`boolean`。

```typescript
let isDone: boolean = false;
```

### 数字 (Number)

和 JavaScript 一样，TypeScript 里的所有数字都是浮点数。这些浮点数的类型是
`number`。

```typescript
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

### 字符串 (String)

和 JavaScript 一样，可以使用 `string` 表示文本数据类型。 可以使用双引号 (`"`) 或
单引号 (`'`) 表示字符串。

```typescript
let color: string = 'blue';
color = 'red';
```

还可以使用模板字符串，它可以定义多行文本和内嵌表达式。

```typescript
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`;
```

### 数组 (Array)

TypeScript 像 JavaScript 一样可以操作数组元素。 有两种方式可以定义数组。 第一种
，可以在元素类型后面接上 `[]`，表示由此类型元素组成的一个数组：

```typescript
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```typescript
let list: Array<number> = [1, 2, 3];
```

### 元组 (Tuple)

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```typescript
// 声明一个元组类型
let x: [string, number];
// 初始化
x = ['hello', 10]; // OK
// 初始化错误
x = [10, 'hello']; // Error
```

### 枚举 (Enum)

`enum` 是对 JavaScript 标准数据类型的一个补充。 像 C# 等其它语言一样，使用枚举类
型可以为一组数值赋予友好的名字。

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

默认情况下，从 `0` 开始为成员编号。 你也可以手动的指定成员的数值。

```typescript
enum Color {
  Red = 1,
  Green,
  Blue,
}
let c: Color = Color.Green; // 值为 2
```

或者，全部都采用手动赋值：

```typescript
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green;
```

### Any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来
自于用户输入或第三方代码库。 在这些情况下，我们不希望类型检查器对这些值进行检查
而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any` 类型来标记这些变量。

```typescript
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false; // okay, definitely a boolean
```

### Void

`void` 类型像是与 `any` 类型相反，它表示没有任何类型。 当一个函数没有返回值时，
你通常会见到其返回值类型是 `void`。

```typescript
function warnUser(): void {
  console.log('This is my warning message');
}
```

声明一个 `void` 类型的变量没有什么大用，因为你只能为它赋予 `undefined` 和
`null`。

### Null 和 Undefined

TypeScript 里，`undefined` 和 `null` 两者各自有自己的类型分别叫做 `undefined` 和
`null`。 和 `void` 相似，它们的本身的类型用处不是很大。

默认情况下 `null` 和 `undefined` 是所有类型的子类型。 就是说你可以把 `null` 和
`undefined` 赋值给 `number` 类型的变量。

然而，当你指定了 `--strictNullChecks` 标记，`null` 和 `undefined` 只能赋值给
`void` 和它们各自的类型。

### Never

`never` 类型表示的是那些永不存在的值的类型。 例如， `never` 类型是那些总是会抛出
异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。

````typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}```

### Object

`object` 表示非原始类型，也就是除 `number`，`string`，`boolean`，`symbol`，`null` 或 `undefined` 之外的类型。

使用 `object` 类型，你可以更好地表示像 `Object.create` 这样的 API。

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
````

## 变量声明

### var、let 和 const

在 TypeScript 中，你可以使用 `var`、`let` 和 `const` 来声明变量，它们与
JavaScript 中的作用类似。

- **var**: 存在变量提升和函数作用域的问题，在现代 JavaScript 和 TypeScript 中已
  不推荐使用。
- **let**: 块级作用域，是 `var` 的改进，解决了变量提升等问题。
- **const**: 块级作用域，用于声明常量，一旦赋值后不可再改变。

推荐在 TypeScript 中始终使用 `let` 和 `const`。

### 类型推断

在 TypeScript 中，如果你没有明确指定一个变量的类型，编译器会根据赋给它的值来推断
其类型。

```typescript
let myName = 'Alice'; // TypeScript 推断 myName 的类型为 string
```

这种机制可以让你在编码时减少类型注解的书写，同时又能享受到类型检查的好处。

## 接口 (Interfaces)

接口是 TypeScript 的核心概念之一，它用于定义对象的结构。

### 基本接口

我们可以使用接口来定义一个对象的形状，包括它应该包含哪些属性以及这些属性的类型。

```typescript
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);
```

### 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 可选属性
在属性名后加上 `?`。

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}
```

### 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly` 来
指定只读属性。

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
```

### 函数类型

接口可以描述函数类型。

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function (source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
};
```

### 索引类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如
`a[10]` 或 `ageMap["daniel"]`。

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ['Bob', 'Fred'];

let myStr: string = myArray[0];
```

### 类类型

与 C# 或 Java 里接口的基本作用一样，TypeScript 也能够用它来明确的强制一个类去符
合某种契约。

```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date);
}

class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

### 接口继承

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，
可以更灵活地将接口分割到可重用的模块里。

```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = 'blue';
square.sideLength = 10;
```

## 类 (Classes)

TypeScript 支持基于类的面向对象编程。

### 基本用法

下面是一个基本的类的例子：

```typescript
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

let greeter = new Greeter('world');
```

### 继承

在 TypeScript 里，我们可以使用 `extends` 关键字来实现继承。

```typescript
class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog();
dog.bark();
dog.move(10);
```

### 公共，私有与受保护的修饰符

- **public** (默认) : 公共成员，可以在任何地方被访问。
- **private** : 私有成员，只能在声明它的类内部访问。
- **protected** : 受保护成员，与 `private` 相似，但它在派生类中仍然可以访问。

### 只读修饰符

你可以使用 `readonly` 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数
里被初始化。

```typescript
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}
```

### 存取器

TypeScript 支持通过 `getters/setters` 来截取对对象成员的访问。

```typescript
let passcode = 'secret passcode';

class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (passcode && passcode == 'secret passcode') {
      this._fullName = newName;
    } else {
      console.log('Error: Unauthorized update of employee!');
    }
  }
}
```

### 静态属性

我们也可以创建类的静态成员，这些属性存在于类本身上面而不是类的实例上。

```typescript
class Grid {
  static origin = { x: 0, y: 0 };
  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor(public scale: number) {}
}
```

### 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。

```typescript
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log('roaming the earth...');
  }
}
```

## 函数 (Functions)

### 基本用法

和 JavaScript 一样，TypeScript 函数可以具名函数和匿名函数。

```typescript
// 具名函数
function add(x: number, y: number): number {
  return x + y;
}

// 匿名函数
let myAdd = function (x: number, y: number): number {
  return x + y;
};
```

### 可选参数和默认参数

TypeScript 里的每个函数参数都是必需的。 但在 TypeScript 里我们可以在参数名旁使用
`?` 实现可选参数的功能。

```typescript
function buildName(firstName: string, lastName?: string) {
  // ...
}
```

我们还可以为参数设置一个默认值，当用户没有传递这个参数或传递的值是 `undefined`
时，它们会使用默认值。

```typescript
function buildName(firstName: string, lastName = 'Smith') {
  // ...
}
```

### 剩余参数

必要参数，默认参数和可选参数有个共同点：它们表示某一个参数。 有时，你想同时操作
多个参数，或者你并不知道会有多少参数传递进来。 在 JavaScript 里，你可以使用
`arguments` 来访问所有传入的参数。

在 TypeScript 里，你可以把所有参数收集到一个变量里：

```typescript
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + ' ' + restOfName.join(' ');
}
```

### 函数重载

JavaScript 本身是个动态语言，同一个函数可以接受不同数量或类型的参数。 TypeScript
提供了函数重载的功能来为这种情况提供类型定义。

```typescript
function flip(x: number): number;
function flip(x: string): string;
function flip(x: number | string): number | string {
  if (typeof x === 'number') {
    return -x;
  } else {
    return x.split('').reverse().join('');
  }
}
```

## 泛型 (Generics)

软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。 组件不仅
能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了
十分灵活的功能。

### 基本用法

泛型可以帮助我们创建可重用的组件，一个组件可以支持多种类型的数据。

````typescript
function identity<T>(arg: T): T {
    return arg;
}

let output = identity<string>("myString");  // type of output will be 'string'```

###  泛型变量

使用泛型创建像 `identity` 这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。 换句话说，你必须把这些参数当做是任意或所有类型。

###  泛型类型

泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样。

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
````

### 泛型类

泛型类看上去与泛型接口差不多。 泛型类使用（ `<>`）括起泛型类型，跟在类名后面。

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

### 泛型约束

有时我们想操作某一组类型，并且我们知道这组类型具体有哪些属性。 在 `identity` 例
子中，我们想访问 `arg` 的 `length` 属性，但是编译器并不能证明每种类型都有
`length` 属性，所以就报错了。

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

## 模块 (Modules)

从 ECMAScript 2015 开始，JavaScript 引入了模块的概念。 TypeScript 也共享了这个概
念。

### 导出

任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加 `export` 关键字来导
出。

```typescript
// a.ts
export const name = 'Alice';
export function add(x: number, y: number): number {
  return x + y;
}
```

### 导入

导入一个模块非常简单，使用 `import` 关键字。

```typescript
// b.ts
import { name, add } from './a';

console.log(name); // Alice
console.log(add(1, 2)); // 3
```

### 默认导出

每个模块都可以有一个 `default` 导出。 `default` 导出使用 `export default` 语法。

```typescript
// c.ts
export default function sayHello() {
  console.log('Hello!');
}
```

然后可以这样导入：

```typescript
// d.ts
import sayHello from './c';

sayHello();
```

##0. 命名空间 (Namespaces)

命名空间一个最明确的目的就是解决重名问题。

### 基本用法

命名空间可以包含多个相关的对象，并且可以避免全局命名冲突。

```typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

### 多文件命名空间

当应用程序变得越来越大时，需要将代码分离到不同的文件中以便于维护。 即便如此，所
有的命名空间仍会合并成一个。

##1. 高级类型

### 交叉类型 (Intersection Types)

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为
一种类型，它包含了所需的所有类型的特性。

```typescript
function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{};
  // ...
  return result;
}
```

### 联合类型 (Union Types)

联合类型与交叉类型很有关联，但是使用上却完全不同。 联合类型表示一个值可以是几种
类型之一。 我们用竖线（ `|`）分隔每个类型。

```typescript
function padLeft(value: string, padding: string | number) {
  // ...
}
```

### 类型保护与区分类型 (Type Guards and Differentiating Types)

联合类型的一大问题是，当你想对联合类型的值进行操作时，你必须先判断这个值到底属于
哪个类型。 TypeScript 提供了类型保护机制来解决这个问题。

```typescript
function isNumber(x: any): x is number {
  return typeof x === 'number';
}
```

### 可为 null 的类型 (Nullable Types)

TypeScript 引入了 `--strictNullChecks` 编译选项，当开启该选项后，`null` 和
`undefined` 将不再是所有类型的子类型。 这意味着你不能把 `null` 或 `undefined` 赋
值给一个 `string` 类型的变量。

### 类型别名 (Type Aliases)

类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，
联合类型，元组以及其它任何你需要手写的类型。

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
```

### 字符串字面量类型 (String Literal Types)

字符串字面量类型允许你指定字符串必须的固定值。

```typescript
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out';
```

##2. 配置文件 (tsconfig.json)

`tsconfig.json` 文件是 TypeScript 项目的根目录，它包含了 TypeScript 编译器的配置
选项。

### 基本配置

一个基本的 `tsconfig.json` 文件如下所示：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true
  }
}
```

### 常用编译选项

- **target**: 指定编译后的 ECMAScript 目标版本。
- **module**: 指定生成哪个模块系统代码。
- **strict**: 启用所有严格类型检查选项。
- **outDir**: 指定输出目录。
- **rootDir**: 指定输入文件的根目录。
- **sourceMap**: 生成相应的 `.map` 文件。
- **noImplicitAny**: 在表达式和声明上有隐含的 `any` 类型时报错。
- **strictNullChecks**: 启用严格的 `null` 检查。
