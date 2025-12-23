---
title: Rust入门
description: Rust编程语言入门学习笔记,包括变量、可变性、常量、隐藏等编程概念
pubDate: 2024-10-15
updatedDate: 2024-10-15
tag:
  - rust
---

简单学习rust的笔记 入门了3次

## 编程概念

### 变量和可变性

#### 可变性

```rust
fn main() {
    // 默认不可变, 添加mut为可变
    let x = 5;
    println!("The value of x is: {x}");
    // 默认不可变,不能通过编译
    x = 6;
    println!("The value of x is: {x}");
}

```

#### 常量

```rust
fn main() {
    // 常量永远不可变,同时必须标注类型  命名大写下划线
    const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
    println!("the constant number is {THREE_HOURS_IN_SECONDS}")
}
```

#### 隐藏 (shadowing)

```rust
fn main() {
    let x = 5;
    // 第二个变量遮蔽第一个
    let x = x + 1;

    {
        // 内部作用域
        let x = x * 2;
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
    let spaces = "   ";
    // 实际上创建了一个新变量
    let spaces = spaces.len();

    println!("spaces lens is {spaces}");

    // let mut spaces = "   ";
    // 会报错,因为类型不同
    // spaces = spaces.len();
}
```

### 数据类型

分为两类数据类型子集 标量（scalar）和复合（compound）

当多种类型都有可能时,必须使用类型注解

```rust
let guess:u32 = "32".parse().expect("not a number!");
```

#### 标量类型

##### 整型

有符号和无符号代表数字能否为负数.每一个有符号的变体可以储存包含从 -(2^n - 1) 到 2^n -
1 - 1 在内的数字，这里 _n_ 是变体使用的位数。所以 `i8`
可以储存从 -(2^7) 到 2^7 -
1 在内的数字，也就是从 -128 到 127。无符号的变体可以储存从 0 到 2^n -
1 的数字，所以 `u8` 可以储存从 0 到 2^8 - 1 的数字，也就是从 0 到 255。

可以使用 `57u8` 来指定类型，同时也允许使用 `_`
做为分隔符以方便读数，例如`1_000`，它的值与你指定的 `1000` 相同。

`数字类型默认是 i32`

| 长度    | 有符号  | 无符号  |
| ------- | ------- | ------- |
| 8-bit   | `i8`    | `u8`    |
| 16-bit  | `i16`   | `u16`   |
| 32-bit  | `i32`   | `u32`   |
| 64-bit  | `i64`   | `u64`   |
| 128-bit | `i128`  | `u128`  |
| arch    | `isize` | `usize` |

##### 浮点型

原生的 **浮点数**（_floating-point
numbers_）类型，它们是带小数点的数字。Rust 的浮点数类型是 `f32` 和
`f64`，分别占 32 位和 64 位。默认类型是 `f64`，因为在现代 CPU 中，它与 `f32`
速度几乎一样，不过精度更高。所有的浮点型都是有符号的。

```rust
fn main() {
    let x = 3.3;
    let y: f32 = 3.0;
    println!("the x is {x},the y is {y}");
}
```

##### 布尔

```rust
fn main() {
    let t = true;
    let f: bool = false; // with explicit type annotation
}

```

##### 字符类型

单引号声明 `char` 字面量，而与之相反的是，使用双引号声明字符串字面量

```rust
fn main() {
    let c = 'z';
    let z: char = 'ℤ'; // with explicit type annotation
    let heart_eyed_cat = '😻';
    let name = "zhang fei";
    println!("the c is {c},the z is {z},the cat is {heart_eyed_cat},this name is {name}");
}

```

#### 复合类型

##### 元组类型

元组是一个将多个其他类型的值组合进一个复合类型的主要方式。元组长度固定：一旦声明，其长度不会增大或缩小。

```rust
fn main() {
    let tup = (3, 3.2, 1);
}
```

##### 数组类型

```rust
fn main() {
    // 长度固定,且每个元素类型必须相同
    let a: [i32; 5] = [1, 2, 3, 4, 5];
    // 10个值都为1
    let nums = [1; 10];
    // 访问数组元素
    let first = nums[0] + a[0];
    // 程序会panic
    // let first = nums[99] + a[0];
}
```

数组并不如 vector 类型灵活。vector 类型是标准库提供的一个 **允许**
增长和缩小长度的类似数组的集合类型,当你确定元素个数不会改变时，数组会更有用。例如，当你在一个程序中使用月份名字时，你更应趋向于使用数组而不是 vector，因为你确定只会有 12 个元素。

```rust
fn main() {
  let months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
}
```

### 函数

```rust
fn main() {
    let y = {
        let x = 3;
        // 表达式才会返回值,加上分号就是语句,语句不会返回值
        x + 1
    };
    let result = add(1, 2);
    let f = five();
    println!("The value of y is: {y}");
    print_say_hello("Tom", "Jerry");
    println!("num is {result},f is {f}");
}

fn print_say_hello(first_name: &str, last_name: &str) {
    println!("hello {first_name}-{last_name}!");
}


fn add(num1: i32, num2: i32) -> i32 {
    return num1 + num2;
}

fn five() -> i32 {
    5
}

// 空值 返回

fn test() ->(){

}
```

### 表达式

#### 条件语句

```rust
fn main() {
    let num = 3;
    if num > 3 {
        println!("too big");
    } else if num < 3 {
        println!("too small");
    } else {
        println!("win! ");
    }
    let condition = true;
    // let语句使用if 且不同分支必须返回一个类型
    let number = if condition { 5 } else { 6 };
    // rust条件语句必须显式指示为bool类型
    // if number {
    //     println!("number was three");
    // }
}
```

#### 循环语句

```rust
fn main() {
    let mut count = 10;
    // 循环获取返回值
    let result = 'outside: loop {
        println!("again!");
        if count == 0 {
            // 从循环返回值 循环标签,在多个循环嵌套消除歧义
            break 'outside (loop {
                count += 1;
                if count / 2 == 0 {
                    break count;
                }
            });
        }
        count -= 1;
    };
    println!("result is {result}!");
}
```

```rust
fn main() {
    let mut num = 3;
    while num != 0 {
        println!("num is {num}");
        num -= 1;
    }
    println!("LIFTOFF!!!");
}
```

### 总结

```rust
fn main() {
    let value = fib(30);
    println!("value is {value}");
}

// fib
fn fib(num: i32) -> i32 {
    if num == 1 || num == 2 {
        return 1;
    }
    return fib(num - 1) + fib(num - 2);
}
```

## 练习

相互转换摄氏与华氏温度。

```rust
fn main() {
    let temp = 20;
    let fa = centigrade_to_fahrenheit(temp as f32);
    println!("当前华氏度{}", fa);
    println!("当前摄氏度{}", fahrenheit_to_centigrade(fa));
}

fn centigrade_to_fahrenheit(temp: f32) -> f32 {
    1.8 * temp + 32f32
}
fn fahrenheit_to_centigrade(temp: f32) -> f32 {
    (temp - 32f32) / 1.8
}

```

生成 n 阶斐波那契数列。

## 所有权

### 堆与栈

在很多语言中，你并不需要经常考虑到栈与堆。不过在像 Rust 这样的系统编程语言中，值是位于栈上还是堆上在更大程度上影响了语言的行为以及为何必须做出这样的抉择。我们会在本章的稍后部分描述所有权与栈和堆相关的内容，所以这里只是一个用来预热的简要解释。

栈和堆都是代码在运行时可供使用的内存，但是它们的结构不同。栈以放入值的顺序存储值并以相反顺序取出值。这也被称作
**后进先出**（_last in, first
out_）。想象一下一叠盘子：当增加更多盘子时，把它们放在盘子堆的顶部，当需要盘子时，也从顶部拿走。不能从中间也不能从底部增加或拿走盘子！增加数据叫做
**进栈**（_pushing onto the stack_），而移出数据叫做 **出栈**（_popping off the
stack_）。栈中的所有数据都必须占用已知且固定的大小。在编译时大小未知或大小可能变化的数据，要改为存储在堆上。 堆是缺乏组织的：当向堆放入数据时，你要请求一定大小的空间。内存分配器（memory
allocator）在堆的某处找到一块足够大的空位，把它标记为已使用，并返回一个表示该位置地址的
**指针**（_pointer_）。这个过程称作 **在堆上分配内存**（_allocating on the
heap_），有时简称为 “分配”（allocating）。（将数据推入栈中并不被认为是分配）。因为指向放入堆中数据的指针是已知的并且大小是固定的，你可以将该指针存储在栈上，不过当需要实际数据时，必须访问指针。想象一下去餐馆就座吃饭。当进入时，你说明有几个人，餐馆员工会找到一个够大的空桌子并领你们过去。如果有人来迟了，他们也可以通过询问来找到你们坐在哪。

入栈比在堆上分配内存要快，因为（入栈时）分配器无需为存储新数据去搜索内存空间；其位置总是在栈顶。相比之下，在堆上分配内存则需要更多的工作，这是因为分配器必须首先找到一块足够存放数据的内存空间，并接着做一些记录为下一次分配做准备。

访问堆上的数据比访问栈上的数据慢，因为必须通过指针来访问。现代处理器在内存中跳转越少就越快（缓存）。继续类比，假设有一个服务员在餐厅里处理多个桌子的点菜。在一个桌子报完所有菜后再移动到下一个桌子是最有效率的。从桌子 A 听一个菜，接着桌子 B 听一个菜，然后再桌子 A，然后再桌子 B 这样的流程会更加缓慢。出于同样原因，处理器在处理的数据彼此较近的时候（比如在栈上）比较远的时候（比如可能在堆上）能更好的工作。

当你的代码调用一个函数时，传递给函数的值（包括可能指向堆上数据的指针）和函数的局部变量被压入栈中。当函数结束时，这些值被移出栈。

跟踪哪部分代码正在使用堆上的哪些数据，最大限度的减少堆上的重复数据的数量，以及清理堆上不再使用的数据确保不会耗尽空间，这些问题正是所有权系统要处理的。一旦理解了所有权，你就不需要经常考虑栈和堆了，不过明白了所有权的主要目的就是为了管理堆数据，能够帮助解释为什么所有权要以这种方式工作。

### 规则

1. Rust 中的每一个值都有一个 **所有者**（_owner_）。
2. 值在任一时刻有且只有一个所有者。
3. 当所有者（变量）离开作用域，这个值将被丢弃。

等效于

- 当 `s` **进入作用域** 时，它就是有效的。
- 这一直持续到它 **离开作用域** 为止。

### String

```rust
fn main() {
    // 分配到堆  String 类型，为了支持一个可变，可增长的文本片段，
    let mut s = String::from("hello world");
    // 下列代码会报错,rust 在处理堆上的变量时,并不会拷贝,也不会让两个指针指向同一块内存
    // 因为会导致内存二次释放的安全性bug,  所以在借用后,s变量就不能再访问
    // 其他语言中成为浅拷贝,深拷贝  rust中称为移动
    // let s2 = s;

    // 若需要深拷贝 可以使用clone,堆上的信息被复制了
    let s2 = s.clone();

    // 栈上的数据会被直接拷贝
    let x = 5;
    let y = x;

    println!("x = {}, y = {}", x, y);
    println!("{s}");
    // 追加字符串
    s.push_str("!");
    println!("{}", s);
    println!("s2 is {}", s2);
} // 离开作用域后自动调用drop函数,回收内存
```

#### 可拷贝的类型

任何不需要分配内存或某种形式资源的类型都可以实现 `Copy` 。如下是一些 `Copy`
的类型：

- 所有整数类型，比如 `u32`。
- 布尔类型，`bool`，它的值是 `true` 和 `false`。
- 所有浮点数类型，比如 `f64`。
- 字符类型，`char`。
- 元组，当且仅当其包含的类型也都实现 `Copy` 的时候。比如，`(i32, i32)` 实现了
  `Copy`，但 `(i32, String)` 就没有。

#### 所有权与函数

```rust
fn main() {
    let name = String::from("zhang fei ");
    // name 进入作用域
    say_hello(name);
    // 离开作用域 name失效
    let x = 3;
    say_num(x);
    // x仍然能使用
    println!("{}", x);
}

fn say_hello(name: String) {
    // 进入作用域
    println!("hello {}!", name);
    // 释放name
}

fn say_num(num: i32) {
    // 可copy 所以没有什么特殊之处
    println!("num is {}!", num);
}
```

#### 返回值与作用域

```rust
fn main() {
    // 所有权转义给s
    let s = give_ownership();
    let s2 = String::from("hello");
    // s2被移动到函数中,并返回
    let s3 = takes_and_give_back(s2);
}

fn give_ownership() -> String {
    String::from("hello")
}

fn takes_and_give_back(s: String) -> String {
    // 使用值,并返回
    s
}
```

#### 转移返回值的所有权

```rust
fn main() {
    let s1 = String::from("hello");

    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len(); // len() 返回字符串的长度
    (s, length)
}
```

### 引用与借用

![image-20230619113411045](https://raw.githubusercontent.com/susanforme/img/main/img/2023/06/19/11%E6%97%B634%E5%88%8611%E7%A7%929204ecdbeddc2a0e966b3fcf58d9b72a-image-20230619113411045-5a7ed7.png)

#### 借用

```rust
fn main() {
    let str = String::from("hello world");
    let len = calculate_len(&str);
    // 把对象的引用作为参数而不是所有权的转移,使用值
    println!("len is {}! str is {}!", len, str);
}

fn calculate_len(s: &String) -> usize {
    s.len()
}
fn change(s: &String) {
    // 不能修改借用的值
    s.push_str("!");
}
```

#### [可变引用](https://kaisery.github.io/trpl-zh-cn/ch04-02-references-and-borrowing.html#可变引用)

```rust
fn main() {
    let mut str2 = String::from("hello world");

    let p1 = &mut str2;
    change(p1); // 成功 ,并未在第二个引用创建前操作
                // 如果你有一个对该变量的可变引用，你就不能再创建对该变量的引用。这些尝试创建两个 s 的可变引用的代码会失败：
    let p2 = &mut str2;
    //  change(p1); 报错,不能存在对同一变量的可变引用
    change(p2);
    println!("str2 is {}!", str2);
    // 第一次借用在这释放, 但是第二次借用却在之前创建了引用
}

fn change(s: &mut String) {
    // 不能修改借用的值
    s.push_str("!");
}
```

防止同一时间对同一数据存在多个可变引用。这个限制的好处是 Rust 可以在编译时就避免数据竞争。**数据竞争**（_data
race_）类似于竞态条件，它可由这三个行为造成：

- 两个或更多指针同时访问同一数据。
- 至少有一个指针被用来写入数据。
- 没有同步数据访问的机制。

可以使用大括号来创建一个新的作用域，以允许拥有多个可变引用，只是不能 **同时**
拥有：

```rust
let mut s = String::from("hello");
    {
        let r1 = &mut s;
    } // r1 在这里离开了作用域，所以我们完全可以创建一个新的引用
let r2 = &mut s;
```

同时使用可变与不可变同样的规则

```rust
 let mut s = String::from("hello");
    let r1 = &s; // 没问题
    let r2 = &s; // 没问题
    let r3 = &mut s; // 大问题
println!("{}, {}, and {}", r1, r2, r3); // 同一时间使用多引用
```

**不能在拥有不可变引用的同时拥有可变引用。**

##### 引用的作用域

引用的作用域从声明的地方开始一直持续到最后一次使用为止

```rust
let mut s = String::from("hello");
let r1 = &s; // 没问题
let r2 = &s; // 没问题
println!("{} and {}", r1, r2);
// 此位置之后 r1 和 r2 不再使用
let r3 = &mut s; // 没问题
println!("{}", r3);
```

#### 悬垂引用

在具有指针的语言中，很容易通过释放内存时保留指向它的指针而错误地生成一个
**悬垂指针**（_dangling
pointer_），所谓悬垂指针是其指向的内存可能已经被分配给其它持有者。相比之下，在 Rust 中编译器确保引用永远也不会变成悬垂状态：当你拥有一些数据的引用，编译器确保数据不会在其引用之前离开作用域。

```rust
fn main() {
    let reference_to_nothing = dangle();
}
fn dangle() -> &String {
    let s = String::from("hello");
    &s // 返回字符串s的引用
}// 离开作用域被抛弃,所以抛出错误

// 直接返回一个值则不会有错误
fn no_dangle() -> String {
    let s = String::from("hello");
    s // 所有权被转移,没有值被释放
}
```

#### 总结

- 在任意给定时间，**要么** 只能有一个可变引用，**要么** 只能有多个不可变引用。
- 引用必须总是有效的。

### Slice

slice 是一个指向一些数据的指针，并带有该 slice 的长度。可以使用 len 方法获取 slice 的长度

#### 为什么使用 slice

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s); // word 的值为 5

    s.clear(); // 这清空了字符串，使其等于 ""

    // word 在此处的值仍然是 5，
    // 但是没有更多的字符串让我们可以有效地应用数值 5。word 的值现在完全无效！
}

fn first_word(str: &String) -> usize {
    // 转换为字节数组
    let bytes = str.as_bytes();
    // 创建一个迭代器 , 第一个元素是索引,第二个是元素的引用
    for (i, &item) in bytes.iter().enumerate() {
        // 找到空格返回她的位置
        if item == b' ' {
            return i;
        }
    }
    str.len()
}
```

这个程序编译时没有任何错误，而且在调用 `s.clear()` 之后使用 `word`
也不会出错。因为 `word` 与 `s` 状态完全没有联系，所以 `word `仍然包含值
`5`。可以尝试用值 `5` 来提取变量 `s`
的第一个单词，不过这是有 bug 的，因为在我们将 `5` 保存到 `word` 之后 `s`
的内容已经改变。

我们不得不时刻担心 `word` 的索引与 `s`
中的数据不再同步，这很啰嗦且易出错！如果编写这么一个 `second_word`
函数的话，管理索引这件事将更加容易出问题。它的签名看起来像这样：

```rust
fn second_word(s: &String) -> (usize, usize) {
```

现在我们要跟踪一个开始索引 **和**
一个结尾索引，同时有了更多从数据的某个特定状态计算而来的值，但都完全没有与这个状态相关联。现在有三个飘忽不定的不相关变量需要保持同步。

#### 字符串 slice

```rust
fn main() {
    let s = String::from("hello world");
    let hello = &s[0..5];
    let world = &s[6..11];
}
```

一个由中括号中的 `[starting_index..ending_index]`
指定的 range 创建一个 slice，其中 `starting_index`
是 slice 的第一个位置，`ending_index` 则是 slice 最后一个位置的后一个值

slice 内部，slice 的数据结构存储了 slice 的开始位置和长度，长度对应于
`ending_index` 减去 `starting_index` 的值。所以对于 `let world = &s[6..11];`
的情况，`world` 将是一个包含指向 `s` 索引 6 的指针和长度值 5 的 slice

![image-20230625115015869](https://raw.githubusercontent.com/susanforme/img/main/img/2023/06/25/11%E6%97%B650%E5%88%8615%E7%A7%9238c0a9a27cada652b957b03471240654-image-20230625115015869-225270.png)

```rust
fn main() {
    let s = String::from("hello world");
    let hello = &s[0..5];
    let world = &s[6..11];
    // 索引从0开始,可以不写..之前的值,以下的值是相同的
    let slice = &s[0..2];
    let slice = &s[..2];
    //
    let len = s.len();
    // 同样的如果是最后一个字节也可以省略不写
    let slice = &s[2..];
    let slice = &s[2..len];
    // 同时舍弃
    let slice = &s[..];
    let slice = &s[0..len];
}
```

#### 改写

```rust
fn main() {
    let mut s = String::from("hello world");
    // 等价于String的slice
    let word = first_word(&s);
    // 清空时,尝试获取可变引用,但是word的不可变引用仍然存在,所以报错
    s.clear();
    println!("the first word is {}!", word);
}

fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    return &s[..];
}

```

#### 字符串字面值就是 slice

```rust
// s的类型就是&str
let s = "Hello, world!";
```

#### 字符串 slice 作为参数

```rust
fn main() {
    let my_string = String::from("hello world");

    // `first_word` 适用于 `String`（的 slice），部分或全部
    let word = first_word(&my_string[0..6]);
    let word = first_word(&my_string[..]);
    // `first_word` 也适用于 `String` 的引用，
    // 这等价于整个 `String` 的 slice
    let word = first_word(&my_string);

    let my_string_literal = "hello world";

    // `first_word` 适用于字符串字面值，部分或全部
    let word = first_word(&my_string_literal[0..6]);
    let word = first_word(&my_string_literal[..]);

    // 因为字符串字面值已经 **是** 字符串 slice 了，
    // 这也是适用的，无需 slice 语法！
    let word = first_word(my_string_literal);
}
```

### 其他类型的 slice

```rust
let a =[1,2,3,4];

let slice = &a[1..3];
```

## 结构体

### 结构体的定义及初始化

```rust
// 结构体
struct User {
    // 字段（field）
    active: bool,
    username: String,
    password: String,
    sign_in_count: u64,
}
fn main() {
    // 实例
    let mut user1 = User {
        active: true,
        sign_in_count: 1,
        username: String::from("someusername"),
        password: String::from("password"),
    };
    let user2 = build_user(String::from("user"));
    let user3 = User {
        // username 值为新值,其余值来自于user2
        username: String::from("user3"),
        // 使用user2中的值创建user3
        // !必须放在最后
        ..user2
    };
    // 可变实例可修改字段
    // !Rust 并不允许只将某个字段标记为可变
    user1.password = String::from("test");
}

fn build_user(username: String) -> User {
    User {
        active: true,
        username,
        password: String::from("init"),
        sign_in_count: 1,
    }
}

```

#### **元组结构体**

**元组结构体**（_tuple
structs_）。元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型。当你想给整个元组取一个名字，并使元组成为与其他元组不同的类型时，

```rust
struct Color(i32, i32, i32);
```

#### 没有任何字段的类单元结构体

**类单元结构体**（_unit-like structs_）因为它们类似于
`()`，即[“元组类型”](https://kaisery.github.io/trpl-zh-cn/ch03-02-data-types.html#元组类型)一节中提到的 unit 类型。类单元结构体常常在你想要在某个类型上实现 trait 但不需要在类型中存储数据的时候发挥作用

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

#### 结构体数据的所有权

确保结构体引用的数据有效性跟结构体本身保持一致

在结构体中存储一个引用而不指定生命周期将是无效的

```rust
struct User {
    active: bool,
    // 抛出错误,需要生命周期标记
    username: &str,
    email: &str,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        active: true,
        username: "someusername123",
        email: "someone@example.com",
        sign_in_count: 1,
    };
}
```

#### 结构体例子

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    // 元组
    let rect = (32, 10);
    // 结构体
    let rect2 = Rectangle {
        width: 32,
        height: 10,
    };
    println!("area is {}", area(rect));
    println!("area is {}", area2(&rect2));
}
fn area(rect: (u32, u32)) -> u32 {
    rect.0 * rect.1
}

fn area2(rect: &Rectangle) -> u32 {
    rect.width * rect.height
}
```

#### 直接输出结构体

```rust
##[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rec1 = Rectangle {
        width: 32,
        height: 20,
    };
    // 直接输出内容报错
    println!("rec1 is {:?}", rec1);
}
```

#### 方法调用

```rust
##[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
// 方法  implementation 缩写
impl Rectangle {
    /** 面积计算 */
    fn area(&self) -> u32 {
        self.width * self.height
    }
    // 方法名称可以和结构体字段相同 ,通常只返回值,
    fn width(&self) -> bool {
        self.width > 0
    }
}

fn main() {
    let rec1 = Rectangle {
        width: 32,
        height: 20,
    };
    // 直接输出内容报错,必须使用宏
    println!("rec1 is {:?}", rec1);
    println!("rec1 area is {}", rec1.area());
    if rec1.width() {
        println!("the width is nonzero!");
    }
}
```

**自动引用和解引用**

在 C/C++ 语言中，有两个不同的运算符来调用方法：`.` 直接在对象上调用方法，而 `->`
在一个对象的指针上调用方法，这时需要先解引用（dereference）指针。换句话说，如果
`object` 是一个指针，那么 `object->something()` 就像 `(*object).something()`
一样。

Rust 并没有一个与 `->` 等效的运算符；相反，Rust 有一个叫
**自动引用和解引用**（_automatic referencing and
dereferencing_）的功能。方法调用是 Rust 中少数几个拥有这种行为的地方。

它是这样工作的：当使用 `object.something()` 调用方法时，Rust 会自动为 `object`
添加 `&`、`&mut` 或 `*` 以便使 `object`
与方法签名匹配。也就是说，这些代码是等价的：

```rust
p1.distance(&p2);
(&p1).distance(&p2);
```

第一行看起来简洁的多。这种自动引用的行为之所以有效，是因为方法有一个明确的接收者————
`self`
的类型。在给出接收者和方法名的前提下，Rust 可以明确地计算出方法是仅仅读取（`&self`），做出修改（`&mut self`）或者是获取所有权（`self`）

#### 更多参数的方法

```rust
##[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
// 方法  implementation 缩写
impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let rec1 = Rectangle {
        width: 32,
        height: 20,
    };
    let rect2 = Rectangle {
        width: 22,
        height: 10,
    };
    println!("rect1 can hole rect2? {}!", rec1.can_hold(&rect2));
}
```

#### 关联函数

所有在 `impl` 块中定义的函数被称为 **关联函数**（_associated
functions_），因为它们与 `impl` 后面命名的类型相关。我们可以定义不以 `self`
为第一参数的关联函数（因此不是方法），因为它们并不作用于一个结构体的实例。我们已经使用了一个这样的函数：在
`String` 类型上定义的 `String::from` 函数。

不是方法的关联函数经常被用作返回一个结构体新实例的构造函数。这些函数的名称通常为
`new` ，但 `new` 并不是一个关键字。例如我们可以提供一个叫做 `square`
关联函数，它接受一个维度参数并且同时作为宽和高，这样可以更轻松的创建一个正方形
`Rectangle` 而不必指定两次同样的值

```rust
##[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}
// 多个 impl 块,可以分开写
impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let sq = Rectangle::square(3);
}
```

## 枚举

`IpAddr::V4()` 是一个获取 `String` 参数并返回 `IpAddr`
类型实例的函数调用。作为定义枚举的结果，这些构造函数会自动被定义。

```rust
enum IpAddrKind {
    v4,
    v6,
}
enum IpAddr {
    v4(String),
    v6(String),
}

struct Ip {
    kind: IpAddrKind,
    address: String,
}
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
impl Message {
    fn call(&self) {
        println!("call!",);
    }
}

fn main() {
    let four = IpAddrKind::v4;
    let six = IpAddrKind::v6;
    let home = Ip {
        kind: IpAddrKind::v4,
        address: String::from("192.168.1.1"),
    };
    // 和上方含义相同
    let home2 = IpAddr::v4(String::from("127.0.0.1"));
    let m = Message::Write(String::from("message"));
    m.call();
}

```

### [`Option` 枚举和其相对于空值的优势](https://kaisery.github.io/trpl-zh-cn/ch06-01-defining-an-enum.html#option-枚举和其相对于空值的优势)

```rust
// 存在标准库中
enum Option<T> {
    None,
    Some(T),
}
```

```rust
fn main() {
    let some_number = Some(5);
    let some_char = Some('e');

    let absent_number: Option<i32> = None;
}
```

当有一个 `Some` 值时，我们就知道存在一个值，而这个值保存在 `Some` 中。当有个
`None`
值时，在某种意义上，它跟空值具有相同的意义：并没有一个有效的值。那么，`Option<T>`
为什么就比空值要好呢？

简而言之，因为 `Option<T>` 和 `T`（这里 `T`
可以是任何类型）是不同的类型，编译器不允许像一个肯定有效的值那样使用
`Option<T>`。例如，这段代码不能编译，因为它尝试将 `Option<i8>` 与 `i8` 相加：

```rust
let x: i8 = 5;
let y: Option<i8> = Some(5);

let sum = x + y;
```

### match 控制流匹配

#### 绑定值的模式

```rust
##[derive(Debug)] // 这样可以立刻看到州的名称
enum UsState {
    Alabama,
    Alaska,
    // --snip--
}

fn main() {
    value_in_cents(Coin::Penny);
    let cent = value_in_cents(Coin::Quarter(UsState::Alabama));
    println!(" cent is {}", cent);
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("lucky Penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("state from {:?}!", state);
            25
        }
    }
}
```

#### 匹配

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        // 必须覆盖所有可能性
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let value = plus_one(Some((10)));
}

```

#### 通配

```rust
fn main() {
    let roll = 9;
    match roll {
        1 => {
            println!("bingo your value is {}!", 1);
        }
        // 通配必须放最后,顺序匹配
        other => move_player(other),
        // 占位符 最后一个分支中明确地忽略了其他的值
        // _ => (),
    }
}

fn move_player(num: i32) {
    println!("other value is {}!", num);
}

```

#### if let 语法糖

```rust
fn main() {
    // 等同于 config_max:u8 = 3;
    let config_max = Some(3u8);
    // match的语法糖
    if let Some(max) = config_max {
        println!("the maximum is configured to be {}", max);
    }
    match config_max {
        Some(max) => println!("The maximum is configured to be {}", max),
        _ => (),
    }
    let mut count = 0;
    if let Coin::Quarter = Coin::Penny {
        println!("coin is 25");
    } else {
        count += 1;
    }
    println!("not Quarter count is {}!", count);
}

enum Coin {
    Quarter = 25,
    Penny = 1,
}

```

## 包和crate

crate 是 Rust 在编译时最小的代码单位。如果你用 `rustc` 而不是 `cargo`
来编译一个文件（第一章我们这么做过），编译器还是会将那个文件认作一个 crate。

### crate

含两种 这两种叫create根

- 二进制项 必须要有main
- 库 并没有main函数

### 包 package

一个包会包含一个 _Cargo.toml_
文件，阐述如何去构建这些 crate。Cargo 就是一个包含构建你代码的二进制项的包。Cargo 也包含这些二进制项所依赖的库。其他项目也能用 Cargo 库来实现与 Cargo 命令行程序一样的逻辑。

一个包可以拥有多个二进制 crate

## 定义模块控制作用域和私有性

- **从 crate 根节点开始**: 当编译一个 crate, 编译器首先在 crate 根文件（通常，对于一个库 crate 而言是*src/lib.rs*，对于一个二进制 crate 而言是*src/main.rs*）中寻找需要被编译的代码。

- 声明模块

  : 在 crate 根文件中，你可以声明一个新模块；比如，你用

  ```
  mod garden
  ```

  声明了一个叫做

  ```
  garden
  ```

  的模块。编译器会在下列路径中寻找模块代码：
  - 内联，在大括号中，当`mod garden`后方不是一个分号而是一个大括号
  - 在文件 _src/garden.rs_
  - 在文件 _src/garden/mod.rs_

- 声明子模块

  : 在除了 crate 根节点以外的其他文件中，你可以定义子模块。比如，你可能在

  src/garden.rs中定义了

  ```
  mod vegetables;
  ```

  。编译器会在以父模块命名的目录中寻找子模块代码：
  - 内联，在大括号中，当`mod vegetables`后方不是一个分号而是一个大括号
  - 在文件 _src/garden/vegetables.rs_
  - 在文件 _src/garden/vegetables/mod.rs_

- **模块中的代码路径**: 一旦一个模块是你 crate 的一部分，你可以在隐私规则允许的前提下，从同一个 crate 内的任意地方，通过代码路径引用该模块的代码。举例而言，一个 garden
  vegetables 模块下的`Asparagus`类型可以在`crate::garden::vegetables::Asparagus`被找到。

- **私有 vs 公用**: 一个模块里的代码默认对其父模块私有。为了使一个模块公用，应当在声明时使用`pub mod`替代`mod`。为了使一个公用模块内部的成员公用，应当在声明前使用`pub`。

- **`use`
  关键字**: 在一个作用域内，`use`关键字创建了一个成员的快捷方式，用来减少长路径的重复。在任何可以引用`crate::garden::vegetables::Asparagus`的作用域，你可以通过
  `use crate::garden::vegetables::Asparagus;`创建一个快捷方式，然后你就可以在作用域中只写`Asparagus`来使用该类型。

### 例

模块树

```
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

## 引用模块中的路径

路径有两种形式：

- **绝对路径**（_absolute
  path_）是以 crate 根（root）开头的全路径；对于外部 crate 的代码，是以 crate 名开头的绝对路径，对于对于当前 crate 的代码，则以字面值
  `crate` 开头。
- **相对路径**（_relative path_）从当前模块开始，以 `self`、`super`
  或当前模块的标识符开头。

/src/lib.rs

```rust
// 定义模块

// pub 来设计公有的结构体和枚举 在一个结构体定义的前面使用了 pub ，这个结构体会变成公有的，但是这个结构体的字段仍然是私有的
mod front_of_house {
    // 模块内还能定义模块
    pub mod hosting {
        pub fn add_waitlist() {}
        fn seat_table() {
            // 从父级模块开始构建相对路径
            super::test();
        }
    }
    pub mod serving {
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
    // 同样可以定义函数
    fn test() {}
}
pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_waitlist();

    // 相对路径
    front_of_house::hosting::add_waitlist();
}

```

#### 创建公有的结构体和枚举

```rust
mod back_of_house {
    // 当结构体是公有的,其成员并不会都是公有
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }
    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
    // 当枚举是公有的,那么其所有成员都是公有的
    pub enum Color {
        Red,
        Blue,
    }
}

pub fn eat_at_restaurant() {
    let mut meal = back_of_house::Breakfast::summer("Rye");
    meal.toast = String::from("Wheat");
    println!("i`d like {} toast plz!", meal.toast);
    // 不能查看私有字段
    // meal.seasonal_fruit
}

```

### 使用use关键字将路径引入作用域

在作用域中增加 `use` 和路径类似于在文件系统中创建软连接（符号连接，symbolic
link）。通过在 crate 根增加 `use crate::front_of_house::hosting`，现在 `hosting`
在作用域中就是有效的名称了，如同 `hosting` 模块被定义于 crate 根一样。通过 `use`
引入作用域的路径也会检查私有性，同其它路径一样。

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
// 相当于crate根
use crate::front_of_house::hosting;

mod customer {

    pub fn eat_at_restaurant() {
        // 编译失败
        hosting::add_to_waitlist();
        // 编译成功
        super::hosting::add_to_waitlist();
    }
}

```

#### 将hashmap引入二进制crate的习惯用法

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert(1, 2);
}
```

#### 当具有共同名称项

1.使用父模块可以区分这两个 `Result` 类型

```rust
use std::fmt;
use std::io;

fn function1() -> fmt::Result {
    // --snip--
    Ok(())
}

fn function2() -> io::Result<()> {
    // --snip--
    Ok(())
}
```

2.使用as提供新的名字

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // --snip--
    Ok(())
}

fn function2() -> IoResult<()> {
    // --snip--
    Ok(())
}
```

#### pub use 重导出

use导入之后 对其他作用域之外是私有的,pub允许别人将它导入自己的作用域

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

#### 外部包

命令行安装

```bash
cargo add tauri
```

文件名：Cargo.toml 添加依赖

```toml
rand = "0.8.5"
```

```rust
use std::io;
use rand::Rng;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    println!("The secret number is: {secret_number}");

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {guess}");
}
```

#### 嵌套路径消除

```rust
use rand::Rng;
// --snip--
use std::cmp::Ordering;
use std::io;
// --snip--
```

```rust
use std::{cmp::Ordering, io};
```

1.将多个带有相同项引入作用域

```rust
use std::io;
use std::io::Write;
// 等同于
use std::io::{self, Write};
```

#### 通过 glob 运算符将所有的公有定义引入作用域

```rust
use std::collections::*;
```

这个 `use` 语句将 `std::collections`
中定义的所有公有项引入当前作用域。使用 glob 运算符时请多加小心！Glob 会使得我们难以推导作用域中有什么名称和它们是在何处定义的。

glob 运算符经常用于测试模块 `tests`
中，这时会将所有内容引入作用域；我们将在第十一章 “如何编写测试” 部分讲解。glob 运算符有时也用于 prelude 模式；查看
[标准库中的文档](https://doc.rust-lang.org/std/prelude/index.html#other-preludes)
了解这个模式的更多细节。

### 模块拆分

一个文件尽量只有一个模块

#### 另一种文件路径

目前为止我们介绍了 Rust 编译器所最常用的文件路径；不过一种更老的文件路径也仍然是支持的。

对于声明于 crate 根的 `front_of_house` 模块，编译器会在如下位置查找模块代码：

- _src/front_of_house.rs_（我们所介绍的）
- _src/front_of_house/mod.rs_（老风格，不过仍然支持）

对于 `front_of_house` 的子模块 `hosting`，编译器会在如下位置查找模块代码：

- _src/front_of_house/hosting.rs_（我们所介绍的）
- _src/front_of_house/hosting/mod.rs_（老风格，不过仍然支持）

如果你对同一模块同时使用这两种路径风格，会得到一个编译错误。在同一项目中的不同模块混用不同的路径风格是允许的，不过这会使他人感到疑惑。

使用 _mod.rs_ 这一文件名的风格的主要缺点是会导致项目中出现很多 _mod.rs_
文件，当你在编辑器中同时打开他们时会感到疑惑。

## 集合

常用集合

- _vector_ 允许我们一个挨着一个地储存一系列数量可变的值
- **字符串**（_string_）是字符的集合。我们之前见过 `String`
  类型，不过在本章我们将深入了解。
- **哈希 map**（_hash
  map_）允许我们将值与一个特定的键（key）相关联。这是一个叫做 _map_
  的更通用的数据结构的特定实现。

### vector

文档 https://doc.rust-lang.org/std/vec/struct.Vec.html

```rust
fn main() {
    // 创建空的vector
    let mut v: Vec<i32> = Vec::new();
    // 使用vec!宏 创建信的vector
    let mut other_v = vec![1, 2, 3];
    // 添加元素
    v.push(5);
    other_v.push(4);
    // 读取vector 得到索引元素位置的引用
    let third: &i32 = &v[0];
    println!("The third element is {third}");

    // 返回的是一个Option 使用get访问
    let four = other_v.get(3);
    match four {
        Some(value) => {
            println!("value is {value} !");
        }
        None => {
            println!("there is not four element!");
        }
    }
    // 遍历元素 获取不可变引用并打印
    for i in &v {
        println!("i is {i}");
    }
    // 可变引用并修改
    for i in &mut other_v {
        // 解引用获取值
        *i += 50;
    }
}

```

#### 在拥有vector的引用时同时向其增加一个元素

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    // 指向第一个元素
    let first = &v[0];
    // 编译错误
    v.push(6);

    println!("The first element is: {first}");
}
```

为什么第一个元素的引用会关心 vector 结尾的变化？不能这么做的原因是由于 vector 的工作方式：在 vector 的结尾增加新元素时，在没有足够空间将所有元素依次相邻存放的情况下，可能会要求分配新内存并将老的元素拷贝到新的空间中。这时，第一个元素的引用就指向了被释放的内存。借用规则阻止程序陷入这种状况。

#### 使用枚举来存储多类型

```rust
enum SpreadSheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}
fn main() {
    // 存储不同类型
    let row = vec![
        SpreadSheetCell::Int(32),
        SpreadSheetCell::Float(32.3),
        SpreadSheetCell::Text(String::from("value")),
    ];
}

```

### 离开作用域释放所有元素

```rust
fn main() {
    {
        let v = vec![1, 2, 3, 4];

        // do stuff with v
    } // <- v goes out of scope and is freed here
}
```

### 字符串

```rust
fn main() {
    // 新建字符串
    let mut s = String::from("hello");
    // l新建空的string 可用于字符串字面值
    let data = "initial contents";
    let s1 = data.to_string();
    // 附加字符串slice
    s.push_str(" world");
    // 单独字符作为参数
    s.push('!');
    println!("{s}");
}

```

使用+运算符将两个String合并到新的String

```rust
fn main(){
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    // 注意 s1 被移动了，不能继续使用
    let s3 = s1 + &s2;
    // 编译失败
    // s1.push('c');
    println!("s3 is {}!", s3);
}
```

执行完这些代码之后，字符串 `s3` 将会包含 `Hello, world!`。`s1`
在相加后不再有效的原因，和使用 `s2` 的引用的原因，与使用 `+`
运算符时调用的函数签名有关。`+` 运算符使用了 `add`
函数，这个函数签名看起来像这样：

```rust
fn add(self, s: &str) -> String
```

`s2` 使用了 `&`，意味着我们使用第二个字符串的 **引用**
与第一个字符串相加。这是因为 `add` 函数的 `s` 参数：只能将 `&str` 和 `String`
相加，不能将两个 `String` 值相加。不过等一下 —— 正如 `add`
的第二个参数所指定的，`&s2` 的类型是 `&String` 而不是
`&str`。那么为什么示例 8-18 还能编译呢？

之所以能够在 `add` 调用中使用 `&s2` 是因为 `&String` 可以被
**强转**（_coerced_）成 `&str`。当`add`函数被调用时，Rust 使用了一个被称为
**Deref 强制转换**（_deref coercion_）的技术，你可以将其理解为它把 `&s2` 变成了
`&s2[..]`。第十五章会更深入的讨论 Deref 强制转换。因为 `add`
没有获取参数的所有权，所以 `s2` 在这个操作后仍然是有效的 `String`。

发现签名中 `add` 获取了 `self` 的所有权，因为 `self` **没有** 使用
`&`。这意味着示例 8-18 中的 `s1` 的所有权将被移动到 `add`
调用中，之后就不再有效。

实际上这个语句会获取 `s1` 的所有权，附加上从 `s2`
中拷贝的内容，并返回结果的所有权

#### 复杂字符串连接使用format宏

```rust
fn main() {
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");

    let s = format!("{s1}-{s2}-{s3}");
    // 编译失败,所有权被移动
    // s3.push('1');
}
```

#### 索引字符串

rust中不支持通过索引访问String的一部分

`String` 是一个 `Vec<u8>` 的封装。

```rust
fn main() {
    let s1 = String::from("hello");
    let h = s1[0];
}
```

Rust 不允许使用索引获取 `String`
字符的原因是，索引操作预期总是需要常数时间（O(1)）。但是对于 `String`
不可能保证这样的性能，因为 Rust 必须从开头到索引位置遍历来确定有多少有效的字符。

#### 字符串slice

```rust
fn main() {
    let s1 = String::from("tic");
    let s = &s1[0..2];
    for c in s.chars() {
        println!("{c}");
    }
}
```

&hello[0..1] 会panic

## Hash Map

和vector一样存储在堆

```rust
use std::collections::HashMap;
fn main() {
    // 所有的键必须是相同类型，值也必须都是相同类型。
    let mut scores = HashMap::new();
    scores.insert(String::from("blue"), 10);
    scores.insert(String::from("yellow"), 40);

    // 访问map中的值
    let team_name = String::from("blue");
    // get方法返回Option<&V> copied获取Option<T> 接着调用 unwrap_or 在 score 中没有该键所对应的项时将其设置为零。
    let score = scores.get(&team_name).copied().unwrap_or(0);
    println!("the {} team score is {}!", team_name, score);

    // 遍历 注意是随机顺序遍历
    for (key, value) in &scores {
        println!("{key}:{value}");
    }
    // hash map与所有权
    let field_name = String::from("favorite color");
    let filed_value = String::from("blue");
    let mut favorite_color = HashMap::new();
    favorite_color.insert(field_name, filed_value);
    // 所有权转移了,插入后所有权归hash map所有 之后不能使用field_name field_value
    // println!("{field_name}");
}

```

#### 处理key相同

hash map 中的key是唯一的

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Blue"), 20);
    // 只在key没有对应值插入
    scores.entry(String::from("Blue")).or_insert(30);
    // entry方法返回一个 Entry<'_, K, V>
    scores.entry(String::from("Yellow")).or_insert(30);
    println!("{:?}", scores);
}
```

#### 根据旧的值更新值

```rust
use std::collections::HashMap;

fn main() {
    let text = String::from("hello world wonderful world");
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }
    println!("{:?}", map);
}
```

#### hash函数

`HashMap` 默认使用一种叫做 SipHash 的哈希函数，它可以抵御涉及哈希表（hash
table）[1](https://kaisery.github.io/trpl-zh-cn/ch08-03-hash-maps.html#siphash)
的拒绝服务（Denial of Service,
DoS）攻击。然而这并不是可用的最快的算法，不过为了更高的安全性值得付出一些性能的代价。如果性能监测显示此哈希函数非常慢，以致于你无法接受，你可以指定一个不同的
_hasher_ 来切换为其它函数。hasher 是一个实现了 `BuildHasher`
trait 的类型。第十章会讨论 trait 和如何实现它们。你并不需要从头开始实现你自己的 hasher；[crates.io](https://crates.io/)
有其他人分享的实现了许多常用哈希算法的 hasher 的库

## 练习

给定一系列数字，使用 vector 并返回这个列表的中位数（排列数组后位于中间的值）和众数（mode，出现次数最多的值；这里哈希 map 会很有帮助）

```rust
fn main() {
    let vec = vec![3, 3, 7, 4, 9, 9, 111, 1, 1, 1];
    let median = vec[vec.len() / 2];
    let mut mode_count = 0;
    let mut mode_index = 0;

    for i in 0..vec.len() {
        let mut count = 0;
        for k in 0..vec.len() {
            if vec[k] == vec[i] {
                count += 1;
            }
        }
        if count >= mode_count {
            mode_count = count;
            mode_index = i;
        }
    }
    println!(
        "众数是{},中位数是{}!",
        vec[mode_index], median
    );
}

```

hash map计算众数

```rust
use std::cmp::max;
use std::collections::HashMap;
fn main() {
    let vec = vec![3, 3, 7, 4, 9, 9, 111, 1, 1, 1];
    let mut map = HashMap::new();
    let mut count = 0;
    let mut key = 0;

    for i in 0..vec.len() {
        let count = map.entry(vec[i]).or_insert(0);
        *count += 1;
    }
    for k in map.keys() {
        let max_num = max(count, map.get(k).copied().unwrap_or(0));
        if max_num != count {
            key = *k;
            count = max_num;
        }
    }
    println!("众数是{},重复{}次!", &key, count);
}
```

将字符串转换为 Pig
Latin，也就是每一个单词的第一个辅音字母被移动到单词的结尾并增加 “ay”，所以 “first” 会变成 “irst-fay”。元音字母开头的单词则在结尾增加 “hay”（“apple” 会变成 “apple-hay”）。牢记 UTF-8 编码！

```rust
fn main() {
    let statement = String::from("first day! apple!");
    let vowel = vec!['a', 'e', 'i', 'o', 'u'];
    let mut new_statement = String::from("");
    for word in statement.split_whitespace() {
        if vowel.contains(&word.chars().next().unwrap()) {
            new_statement.push_str(&format!("{word}-hay"));
        } else {
            let new_word = &word[1..word.len()];
            new_statement.push_str(&format!("{new_word}-fay"));
        }
        new_statement.push(' ');
    }
    println!("{}", new_statement);
}

```

使用哈希 map 和 vector，创建一个文本接口来允许用户向公司的部门中增加员工的名字。例如，“Add
Sally to Engineering” 或 “Add Amir to
Sales”。接着让用户获取一个部门的所有员工的列表，或者公司每个部门的所有员工按照字典序排列的列表。

```rust
use std::collections::HashMap;

/** 公司类型定义 */
type Company = HashMap<String, Vec<String>>;

fn main() {
    let mut company: Company = HashMap::new();
    add_department(&mut company, String::from("programming"));
    add_staff(&mut company, "programming", "ran zhi cheng".to_string());
    add_staff(&mut company, "programming", "susan".to_string());
    println!("{:?}", company);
}

fn add_staff(company: &mut Company, department: &str, name: String) -> bool {
    match company.get_mut(department) {
        Some(vec) => {
            vec.push(name);
            return true;
        }
        None => false,
    }
}

fn add_department(company: &mut Company, department: String) {
    company.entry(department).or_insert(Vec::new());
}

```

### 用 `panic!` 处理不可恢复的错误

1.对应 panic 时的栈展开或终止

当出现 panic 时，程序默认会开始
**展开**（_unwinding_），这意味着 Rust 会回溯栈并清理它遇到的每一个函数的数据，不过这个回溯并清理的过程有很多工作。另一种选择是直接
**终止**（_abort_），这会不清理数据就退出程序。

那么程序所使用的内存需要由操作系统来清理。如果你需要项目的最终二进制文件越小越好，panic 时通过在
_Cargo.toml_ 的 `[profile]` 部分增加
`panic = 'abort'`，可以由展开切换为终止。例如，如果你想要在 release 模式中 panic 时直接终止：

```toml
[profile.release]
panic = 'abort'
```

2.显式调用

```rust
fn main() {
    panic!("crash and burn");
}
```

输出

```bash
$ cargo run
   Compiling panic v0.1.0 (file:///projects/panic)
    Finished dev [unoptimized + debuginfo] target(s) in 0.25s
     Running `target/debug/panic`
thread 'main' panicked at 'crash and burn', src/main.rs:2:5
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

第一行显示了 panic 提供的信息并指明了源码中 panic 出现的位置：_src/main.rs:2:5_
表明这是 _src/main.rs_ 文件的第二行第五个字符。

使用 `panic!` 的 backtrace

```bash
$ RUST_BACKTRACE=1 cargo run
thread 'main' panicked at 'index out of bounds: the len is 3 but the index is 99', src/main.rs:4:5
stack backtrace:
   0: rust_begin_unwind
             at /rustc/e092d0b6b43f2de967af0887873151bb1c0b18d3/library/std/src/panicking.rs:584:5
   1: core::panicking::panic_fmt
             at /rustc/e092d0b6b43f2de967af0887873151bb1c0b18d3/library/core/src/panicking.rs:142:14
   2: core::panicking::panic_bounds_check
             at /rustc/e092d0b6b43f2de967af0887873151bb1c0b18d3/library/core/src/panicking.rs:84:5
   3: <usize as core::slice::index::SliceIndex<[T]>>::index
             at /rustc/e092d0b6b43f2de967af0887873151bb1c0b18d3/library/core/src/slice/index.rs:242:10
   4: core::slice::index::<impl core::ops::index::Index<I> for [T]>::index
             at /rustc/e092d0b6b43f2de967af0887873151bb1c0b18d3/library/core/src/slice/index.rs:18:9
   5: <alloc::vec::Vec<T,A> as core::ops::index::Index<I>>::index
             at /rustc/e092d0b6b43f2de967af0887873151bb1c0b18d3/library/alloc/src/vec/mod.rs:2591:9
   6: panic::main
             at ./src/main.rs:4:5
   7: core::ops::function::FnOnce::call_once
             at /rustc/e092d0b6b43f2de967af0887873151bb1c0b18d3/library/core/src/ops/function.rs:248:5
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.

```

### 用Result处理可恢复的错误

```rust
use std::{fs::File, io::ErrorKind};
fn main() {
    // File::open 的返回值是 Result<T, E>
    let greeting_file_result = File::open("hello.txt");
    let greeting_file_result = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem opening the file: {:?}", e),
            },
            other_error => {
                panic!("Problem opening the file: {:?}", other_error);
            }
        },
    };
}

```

使用闭包

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });
}

```

错误

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    // 如果调用这段代码时不存在 hello.txt 文件，我们将会看到一个 unwrap 调用 panic! 时提供的错误信息
    // let greeting_file = File::open("hello.txt").unwrap();

    // 使用传递的信息
    let greeting_file =
        File::open("hello.txt").expect("hello.txt should be included in this project");
}
```

#### 传播错误

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello world.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        // 提前结束整个函数
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        // 最后一个不需要return
        Err(e) => Err(e),
    }
}
fn main() {
    let file = read_username_from_file().expect("msg");
}

```

当编写一个其实先会调用一些可能会失败的操作的函数时，除了在这个函数中处理错误外，还可以选择让调用者知道这个错误并决定该如何处理。这被称为
**传播**（_propagating_）错误，这样能更好的控制

##### ?运算符简写

`Result` 值之后的 `?` 被定义为与示例 9-6 中定义的处理 `Result` 值的 `match`
表达式有着完全相同的工作方式。如果 `Result` 的值是 `Ok`，这个表达式将会返回 `Ok`
中的值而程序将继续执行。如果值是 `Err`，`Err`
中的值将作为整个函数的返回值，就好像使用了 `return`
关键字一样，这样错误值就被传播给了调用者。

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file_result = File::open("hello world.txt")?;
    let mut username = String::new();
    username_file_result.read_to_string(&mut username)?;
    Ok(username)
}
```

`File::open` 调用结尾的 `?` 会将 `Ok` 中的值返回给变量
`username_file`。如果发生了错误，`?` 运算符会使整个函数提前返回并将任何 `Err`
值返回给调用代码。同理也适用于 `read_to_string` 调用结尾的 `?`。

##### 链式调用 进一步优化

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();
    File::open("hello world.txt")?.read_to_string(&mut username)?;
    Ok(username)
}
```

##### 实际方法

Rust 提供了名为 `fs::read_to_string` 的函数，它会打开文件、新建一个
`String`、读取文件的内容，并将内容放入
`String`，接着返回它。当然，这样做就没有展示所有这些错误处理的机会了，所以我们最初就选择了艰苦的道路。

```rust
fn read_username_from_file() -> Result<String, io::Error> {
    fs::read_to_string("hello.txt")
}
```

##### 哪里可以使用?运算符

报错 the `?` operator can only be used in a function that returns `Result` or
`Option`

所以只能在返回值为Result和Option中使用

```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")?;
}

```

option值

```rust
fn last_char_of_first_line(text: &str) -> Option<char> {
    text.lines().next()?.chars().last()
}

fn main() {
    assert_eq!(
        last_char_of_first_line("Hello, world\nHow are you today?"),
        Some('d')
    );

    assert_eq!(last_char_of_first_line(""), None);
    assert_eq!(last_char_of_first_line("\nhi"), None);
}

```

### 要不要panic

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    loop {
        // --snip--

        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        let guess: i32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        if guess < 1 || guess > 100 {
            println!("The secret number will be between 1 and 100.");
            continue;
        }

        match guess.cmp(&secret_number) {
            // --snip--
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}

```

改写

```rust
pub struct Guess {
    value: i32,
}
impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("guess num must be between 1 and 100 got{}", value);
        }
        Guess { value }
    }
    pub fn value(&self) -> i32 {
        self.value
    }
}
```

## 泛型

```rust
use std::cmp::PartialOrd;
fn main() {
    let char_list = vec!['y', 'm', 'a', 'q'];
    let number_list = vec![34, 50, 25, 100, 65];
    largest(&char_list);
    largest(&number_list);
}
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}

```

### 结构体中的泛型

```rust
fn main() {
    // 必须相同
    // let wont_work = Point { x: 5, y: 4.0 };
    let float = Point { x: 1.0, y: 4.0 };
}

struct Point<T> {
    x: T,
    y: T,
}

struct Other_point<T, U> {
    x: T,
    y: U,
}

```

### 枚举中的泛型

```rust
// 标准库提供的 Option<T> 枚举
enum Option<T> {
    Some(T),
    None,
}

// 枚举也可以拥有多个泛型类型。第九章使用过的 Result 枚举定义就是一个这样的例子：
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

#### 泛型代码的性能

rust会在编译时进行泛型代码的单态化

```rust
let integer = Some(5);
let float = Some(5.0);
```

```rust
enum Option_i32 {
    Some(i32),
    None,
}

enum Option_f64 {
    Some(f64),
    None,
}

fn main() {
    let integer = Option_i32::Some(5);
    let float = Option_f64::Some(5.0);
}
```

泛型 `Option<T>` 被编译器替换为了具体的定义。

## Trait (类似interface)

_trait_
定义了某个特定类型拥有可能与其他类型共享的功能。可以通过 trait 以一种抽象的方式定义共享的行为。可以使用
_trait bounds_ 指定泛型是任何拥有特定行为的类型。

/src/main

```rust
// Summary必须在本地作用域
use crate::aggregator::Summary;

mod aggregator;

fn main() {
    let tweet = aggregator::Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    };
    println!("1 new tweet: {}", tweet.summarize());
}

```

/src/aggregator

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}
pub trait DefaultSummary {
    // 带有默认实现
    fn default_summarize(&self) -> String {
        String::from("Read More")
    }
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}
impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{},by {} ({})", self.headline, self.author, self.location)
    }
}

// 使用一个空的impl快则调用默认实现
impl DefaultSummary for NewsArticle {}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}:{}", self.username, self.content)
    }
}

// 该参数支持任何实现了指定 trait 的类型 我们可以传递任何 NewsArticle 或 Tweet 的实例来调用 notify
// impl trait 语法
pub fn notify(item: &impl Summary) {
    println!("breaking news! {}", item.summarize());
}

// trait bound
pub fn notify_bound<T: Summary>(item: &T) {
    println!("breaking news! {}", item.summarize());
}

//通过+ 多个trait
pub fn notify_multi(item: &(impl Summary + Display)) {}

// trait bound
pub fn notify_multi_bound<T: Summary + Display>(item: &T) {}

// 多个trait 难以阅读 使用where从句
pub fn notify_where<T, U>(t: &T, u: &U) -> i32
where
    T: Summary + Display,
    U: Clone + Debug,
{
    3
}

// 返回实现了trait 的类型
fn return_summarize(switch: bool) -> impl Summary {
    NewsArticle {
        headline: String::from("Penguins win the Stanley Cup Championship!"),
        location: String::from("Pittsburgh, PA, USA"),
        author: String::from("Iceburgh"),
        content: String::from(
            "The Pittsburgh Penguins once again are the best \
             hockey team in the NHL.",
        ),
    }
}

```

但是不能为外部类型实现外部 trait。例如，不能在 `aggregator` crate 中为 `Vec<T>`
实现 `Display` trait。这是因为 `Display` 和 `Vec<T>`
都定义于标准库中，它们并不位于 `aggregator` crate 本地作用域中。这个限制是被称为
**相干性**（_coherence_）的程序属性的一部分，或者更具体的说是
**孤儿规则**（_orphan rule_），其得名于不存在父类型。

```rust
use std::fmt::Display;

fn main() {}

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

// partialOrd 允许比较 ,Display 允许打印
impl<T: Display + PartialOrd> Pair<T> {
    fn cm_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}

```

## 生命周期

理解 (同时存活,同一时间段的引用要同时存活)

### 悬垂引用

借用检查器

```rust
fn main() {
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {}", r); //          |
}                         // ---------+

```

生命周期注解 r的叫\`a x的叫 \`b

在编译时，Rust 比较这两个生命周期的大小，并发现 `r` 拥有生命周期
`'a`，不过它引用了一个拥有生命周期 `'b` 的对象。程序被拒绝编译，因为生命周期
`'b` 比生命周期 `'a` 要小：被引用的对象比它的引用者存在的时间更短。

```rust
fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}
// 编译失败,函数并不知道返回的引用指向x还是y
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
// 编译成功,返回的函数引用存活一样久
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

#### 生命周期注解语法

```rust
&i32        // 引用
&'a i32     // 带有显式生命周期的引用
&'a mut i32 // 带有显式生命周期的可变引用
```

不同生命周期成功编译

```rust
fn main() {
    let string1 = String::from("long string is long");

    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}
```

尝试在string2离开作用域使用

```rust
fn main() {
    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
    }
    // 因为在string2 已经回收还在使用引用 抛错
    println!("The longest string is {}", result);
}
```

#### 深入理解生命周期

```rust
// 总是返回第一个参数
fn longest<'a>(x: &'a str, y: &str) -> &'a str {
    x
}
```

当从函数返回一个引用，返回值的生命周期参数需要与一个参数的生命周期参数相匹配。如果返回的引用
**没有**
指向任何一个参数，那么唯一的可能就是它指向一个函数内部创建的值。然而它将会是一个悬垂引用，因为它将会在函数结束时离开作用域。

```rust
fn longest<'a>(x: &str, y: &str) -> &'a str {
    let result = String::from("really long string");
    // 编译失败,因为返回值的生命周期与参数完全没有关联
    result.as_str()
}
```

#### 结构体中的生命周期注解

结构体中能包含所有权的类型,也可以包含引用的结构体

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("could not find a .");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}

```

#### 生命周期省略

而且我们需要为那些使用了引用的函数或结构体指定生命周期。然而，第四章的示例 4-9 中有一个函数 它没有生命周期注解却能编译成功：

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

Rust 引用分析的模式被称为 **生命周期省略规则**

函数或方法的参数的生命周期被称为 **输入生命周期**（_input
lifetimes_），而返回值的生命周期被称为 **输出生命周期**（_output lifetimes_）

第一条规则是编译器为每一个引用参数都分配一个生命周期参数。换句话说就是，函数有一个引用参数的就有一个生命周期参数：`fn foo<'a>(x: &'a i32)`，有两个引用参数的函数就有两个不同的生命周期参数，`fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`，依此类推。

第二条规则是如果只有一个输入生命周期参数，那么它被赋予所有输出生命周期参数：`fn foo<'a>(x: &'a i32) -> &'a i32`。

第三条规则是如果方法有多个输入生命周期参数并且其中一个参数是 `&self` 或
`&mut self`，说明是个对象的方法 (method)(译者注：这里涉及 rust 的面向对象参见 17 章)，那么所有输出生命周期参数被赋予
`self` 的生命周期。第三条规则使得方法更容易读写，因为只需更少的符号。

**使用三条规则必须计算出所有引用的生命周期**

```rust
fn longest(x: &str, y: &str) -> &str {}
```

使用第一条规则

```rust
fn longest<'a,'b>(x:&' str,y:&' str)->&str{}
```

不满足第二条及第三条,但是仍然有一个参数,所以报错

#### 静态生命周期

`static 其生命周期存在于整个程序期间

```rust
    let s: &'static str = "hello ";
```

#### 结合泛型类型参数、trait bounds 和生命周期

```rust
fn logest_with_announcement<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where
    T: Display,
{
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

```

## 闭包

Rust 的
**闭包**（_closures_）是可以保存在一个变量中或作为参数传递给其他函数的匿名函数。可以在一个地方创建闭包，然后在不同的上下文中执行闭包运算。不同于函数，闭包允许捕获被定义时所在作用域中的值。我们将展示闭包的这些功能如何复用代码和自定义行为。

### 函数式

```rust
   // can't capture dynamic environment in a fn item
    fn test(a: i32) -> i32 {
        println!("From closure: {:?}", list);
        a
    }
```

### 闭包会捕获环境

闭包捕获定义它的环境中的值以便之后使用

```rust
use std::{thread, time::Duration};

##[derive(Debug, Copy, Clone)]

enum ShirtColor {
    Red,
    Blue,
}

struct Inventory {
    shirts: Vec<ShirtColor>,
}
impl Inventory {
    // 所有权的转移
    fn giveaway(&self, user_prefence: Option<ShirtColor>) -> ShirtColor {
        user_prefence
            .clone()
            // 闭包表达式 这是一个本身不获取参数的闭包（如果闭包有参数，它们会出现在两道竖杠之间）
            // 捕获其环境 相当于js中将函数作为参数
            .unwrap_or_else(|| self.most_stocked())
    }
    fn most_stocked(&self) -> ShirtColor {
        let mut num_red = 0;
        let mut num_blue = 0;

        for color in &self.shirts {
            match color {
                ShirtColor::Blue => num_blue += 1,
                ShirtColor::Red => num_red += 1,
            }
        }
        if num_red > num_blue {
            ShirtColor::Red
        } else {
            ShirtColor::Blue
        }
    }
}

fn main() {
    let store = Inventory {
        shirts: vec![ShirtColor::Blue, ShirtColor::Red, ShirtColor::Blue],
    };
    let user_pref = Some(ShirtColor::Blue);
    let giveaway = store.giveaway(user_pref);
    let user_pref2 = None;
    let giveaway2 = store.giveaway(user_pref2);
    println!(
        "the user with prefence {:?} gets {:?} ",
        user_pref, giveaway
    );
    println!(
        "The user with preference {:?} gets {:?}",
        user_pref2, giveaway2
    );
    let expensive_closure = |num: u32| -> u32 {
        println!("calculating slowly...");
        thread::sleep(Duration::from_secs(2));
        num
    };
    let test = |x| x;
    let n = test(5);
    // 已经推断为i32不能再次调用其他类型
    // let s = test(String::from("value"));
}

```

闭包 定义

```rust
fn  add_one_v1   (x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1  ;
```

### 不可变借用,可变借用,所有权转移

```rust
use std::thread;

fn main() {
    println!("不可变借用:");
    let list = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list);
    // 不可变借用
    let only_borrows = || println!("From closure: {:?}", list);
    only_borrows();
    println!("After calling closure: {:?}", list);

    println!("可变借用:");
    let mut list_mut = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list_mut);
    let mut borrows_mutably = || list_mut.push(7);
    // cannot borrow `list_mut` as immutable because it is also borrowed as mutable
    // println!("After calling closure: {:?}", list_mut);
    borrows_mutably();
    println!("After calling closure: {:?}", list_mut);

    println!("所有权转移:");
    let list_move = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list_move);
    // 新线程可能在主线程剩余部分执行完前执行完，或者也可能主线程先执行完。如果主线程维护了 list 的所有权但      却在新线程之前结束并且丢弃了 list，则在线程中的不可变引用将失效
    // 以便在一个新的线程而非主线程中打印 vector：
    thread::spawn(move || println!("From thread: {:?}", list))
        .join()
        .unwrap();
}

```

### 将被捕获的值移出闭包和 Fn trait

闭包捕获和处理环境中的值的方式影响闭包实现的 trait。Trait 是函数和结构体指定它们能用的闭包的类型的方式。取决于闭包体如何处理值，闭包自动、渐进地实现一个、两个或三个
`Fn` trait。

1. `FnOnce`
   适用于能被调用一次的闭包，所有闭包都至少实现了这个 trait，因为所有闭包都能被调用。一个会将捕获的值移出闭包体的闭包只实现
   `FnOnce` trait，这是因为它只能被调用一次。
2. `FnMut`
   适用于不会将捕获的值移出闭包体的闭包，但它可能会修改被捕获的值。这类闭包可以被调用多次。
3. `Fn`
   适用于既不将被捕获的值移出闭包体也不修改被捕获的值的闭包，当然也包括不从环境中捕获值的闭包。这类闭包可以被调用多次而不改变它们的环境，这在会多次并发调用闭包的场景中十分重要。

#### FnOnce

```rust
impl<T> Option<T> {
    pub fn unwrap_or_else<F>(self, f: F) -> T
    where
       // 表示这个函数F必须能够被调用一次
        F: FnOnce() -> T
    {
        match self {
            Some(x) => x,
            None => f(),
        }
    }
}

```

#### Fn

注意：函数也可以实现所有的三种 `Fn`
traits。如果我们要做的事情不需要从环境中捕获值，则可以在需要某种实现了 `Fn`
trait 的东西时使用函数而不是闭包。举个例子，可以在 `Option<Vec<T>>` 的值上调用
`unwrap_or_else(Vec::new)` 以便在值为 `None` 时获取一个新的空的 vector。

```rust
fn main() {
    let a: Option<Vec<String>> = None;
    let mut b = a.unwrap_or_else(Vec::new);
    b.push(String::from("value"));
    println!("{:?}", b);
}
```

#### FnMut

`sort_by_key` 被定义为接收一个 `FnMut`
闭包的原因是它会多次调用这个闭包：每个 slice 中的元素调用一次。闭包
`|r| r.width` 不捕获、修改或将任何东西移出它的环境，所以它满足 trait
bound 的要求。

```rust
##[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let mut list = [
        Rectangle {
            width: 10,
            height: 1,
        },
        Rectangle {
            width: 3,
            height: 5,
        },
        Rectangle {
            width: 7,
            height: 12,
        },
    ];
    list.sort_by_key(|r| r.width);
    let mut sort_operations = vec![];
    let value = String::from("by key called");
    // 编译错误
    list.sort_by_key(|r| {
        sort_operations.push(value);
        r.width
    });
    // 修复
    let mut num_sort_operations = 0;
    list.sort_by_key(|r| {
        num_sort_operations += 1;
        r.width
    });
    println!("{:#?}", list);
}

```

该代码尝试在闭包的环境中向 `sort_operations` vector 放入 `value`— 一个 `String`
来实现计数。闭包捕获了 `value` 然后通过转移 `value`
的所有权的方式将其移出闭包给到 `sort_operations`
vector。这个闭包可以被调用一次，尝试再次调用它将报错。因为这时 `value`
已经不在闭包的环境中，无法被再次放到 `sort_operations`
中！因而，这个闭包只实现了
`FnOnce`。由于要求闭包必须实现`FnMut`，因此尝试编译这个代码将得到报错：`value`
不能被移出闭包

## 迭代器

在 Rust 中，迭代器是
**惰性的**（_lazy_），这意味着在调用方法使用迭代器之前它都不会有效果。

```rust
fn main() {
    let v = vec![1, 2, 3];
    let v1_iter = v.iter();

    for val in v1_iter {
        println!("Got: {}", val);
    }
    let v2_iter = v.iter();
    // 这些调用 next 方法的方法被称为 消费适配器
    // 获取迭代器的所有权不断调用next
    let total: i32 = v2_iter.sum();
    println!("total is {}", total);

    // 迭代器适配器
    // 需要我们消费迭代器 unused `Map` that must be used iterators are lazy and do nothing unless consumed
    // v.iter().map(|x| x + 1);
    let v3: Vec<_> = v.iter().map(|x| x + 1).collect();
    assert_eq!(v3, vec![2, 3, 4]);
}

```

#### 迭代器 trait

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // 此处省略了方法的默认实现
}
```

```rust
fn main() {
    filters_by_size();
}

##[derive(Debug, PartialEq)]
struct Shoe {
    size: u32,
    style: String,
}

fn shoes_in_size(shoes: Vec<Shoe>, shoe_size: u32) -> Vec<Shoe> {
    //  into_iter 来创建一个获取 vector 所有权的迭代器
    shoes.into_iter().filter(|s| s.size == shoe_size).collect()
}

fn filters_by_size() {
    let shoes = vec![
        Shoe {
            size: 10,
            style: String::from("sneaker"),
        },
        Shoe {
            size: 13,
            style: String::from("sandal"),
        },
        Shoe {
            size: 10,
            style: String::from("boot"),
        },
    ];
    let in_my_size = shoes_in_size(shoes, 10);
    assert_eq!(
        in_my_size,
        vec![
            Shoe {
                size: 10,
                style: String::from("sneaker")
            },
            Shoe {
                size: 10,
                style: String::from("boot")
            },
        ]
    );
}

```

## 性能对比：循环 VS 迭代器

迭代器是 Rust 的 **零成本抽象**（_zero-cost
abstractions_）之一，它意味着抽象并不会引入运行时开销，它与本贾尼·斯特劳斯特卢普（C++ 的设计和实现者）在 “Foundations
of C++”（2012）中所定义的 **零开销**（_zero-overhead_）如出一辙

## cargo

### 采用发布配置自定义构建

```bash
cargo build
cargo build --release
```

配置cargo.toml

```toml
[package]
name = "rust-note"
version = "0.1.0"
edition = "2021"

## See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
rand = "0.8.5"

[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
```

`opt-level`
设置控制 Rust 会对代码进行何种程度的优化。这个配置的值从 0 到 3。越高的优化级别需要更多的时间编译，所以如果你在进行开发并经常编译，可能会希望在牺牲一些代码性能的情况下减少优化以便编译得快一些。因此
`dev` 的 `opt-level` 默认为
`0`。当你准备发布时，花费更多时间在编译上则更好。只需要在发布模式编译一次，而编译出来的程序则会运行很多次，所以发布模式用更长的编译时间换取运行更快的代码。这正是为什么
`release` 配置的 `opt-level` 默认为 `3`。

对于每个配置的设置和其默认值的完整列表，请查看
[Cargo 的文档](https://doc.rust-lang.org/cargo/reference/profiles.html)。

## 发布crate

运行 `cargo doc --open`
会构建当前 crate 文档（同时还有所有 crate 依赖的文档）的 HTML 并在浏览器中打开

Rust 也有特定的用于文档的注释类型，通常被称为 **文档注释**（_documentation
comments_），他们会生成 HTML 文档。这些 HTML 展示公有 API 文档注释的内容，他们意在让对库感兴趣的程序员理解如何
**使用** 这个 crate，而不是它是如何被 **实现** 的。

![image-20230810165832961](https://raw.githubusercontent.com/susanforme/img/main/img/2023/08/10/16%E6%97%B658%E5%88%8633%E7%A7%920dd0e8d1c0304a0f624436f880eda5d0-image-20230810165832961-50bf26.png)

````rust
/// Adds one to the number given.
///
/// # Examples
///
/// ```
/// let arg = 5;
/// let answer = my_crate::add_one(arg);
///
/// assert_eq!(6, answer);
/// ```
pub fn add_one(x: i32) -> i32 {
    x + 1
}

````

## Cargo 工作空间

我们构建一个包含二进制 crate 和库 crate 的包。你可能会发现，随着项目开发的深入，库 crate 持续增大，而你希望将其进一步拆分成多个库 crate。Cargo 提供了一个叫
**工作空间**（_workspaces_）的功能，它可以帮助我们管理多个相关的协同开发的包。

根目录创建cargo.toml

```toml
[workspace]

members = [
  "adder"
]
```

运行 `cargo new adder` 新建 `adder` 二进制 crate

`cargo new add_one --lib`

可以运行 `cargo build` 来构建工作空间。_add_ 目录中的文件应该看起来像这样

```
├── Cargo.lock
├── Cargo.toml
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

工作空间在顶级目录有一个 _target_ 目录；`adder` 并没有自己的 _target_
目录。即使进入 _adder_ 目录运行 `cargo build`，构建结果也位于 _add/target_
而不是
_add/adder/target_。工作空间中的 crate 之间相互依赖。如果每个 crate 有其自己的
_target_ 目录，为了在自己的 _target_
目录中生成构建结果，工作空间中的每一个 crate 都不得不相互重新编译其他 crate。通过共享一个
_target_ 目录，工作空间可以避免其他 crate 多余的重复构建。

为了在顶层 _add_ 目录运行二进制 crate，可以通过 `-p` 参数和包名称来运行
`cargo run` 指定工作空间中我们希望使用的包：

```bash
cargo run -p adder
```

#### 在工作空间中依赖外部包

工作空间只在根目录有一个 _Cargo.lock_，而不是在每一个 crate 目录都有
_Cargo.lock_。这确保了所有的 crate 都使用完全相同版本的依赖。如果在 _Cargo.toml_
和 _add_one/Cargo.toml_ 中都增加 `rand`
crate，则 Cargo 会将其都解析为同一版本并记录到唯一的 _Cargo.lock_
中。使得工作空间中的所有 crate 都使用相同的依赖意味着其中的 crate 都是相互兼容的

现在顶级的 _Cargo.lock_ 包含了 `add_one` 的 `rand` 依赖的信息。然而，即使 `rand`
被用于工作空间的某处，也不能在其他 crate 中使用它，除非也在他们的 _Cargo.toml_
中加入 `rand`。例如，如果在顶级的 `adder` crate 的 _adder/src/main.rs_ 中增加
`use rand;`，会得到一个错误：

### 使用 cargo install 安装二进制文件

`cargo install`
命令用于在本地安装和使用二进制 crate。它并不打算替换系统中的包；它意在作为一个方便 Rust 开发者们安装其他人已经在
[crates.io](https://crates.io/)
上共享的工具的手段。只有拥有二进制目标文件的包能够被安装。**二进制目标**
文件是在 crate 有 _src/main.rs_
或者其他指定为二进制文件时所创建的可执行程序，这不同于自身不能执行但适合包含在其他程序中的库目标文件。通常 crate 的
_README_ 文件中有该 crate 是库、二进制目标还是两者都是的信息。

```bash
cargo install ripgrep
```

**指针**
（_pointer_）是一个包含内存地址的变量的通用概念。这个地址引用，或 “指向”（points
at）一些其他数据。Rust 中最常见的指针是第四章介绍的
**引用**（_reference_）。引用以 `&`
符号为标志并借用了他们所指向的值。除了引用数据没有任何其他特殊功能，也没有额外开销。

另一方面，**智能指针**（_smart
pointers_）是一类数据结构，他们的表现类似指针，但是也拥有额外的元数据和功能。智能指针的概念并不为 Rust 所独有；其起源于 C++ 并存在于其他语言中。Rust 标准库中定义了多种不同的智能指针，它们提供了多于引用的额外功能。为了探索其基本概念，我们来看看一些智能指针的例子，这包括
**引用计数** （_reference
counting_）智能指针类型。这种指针允许数据有多个所有者，它会记录所有者的数量，当没有所有者时清理数据。在 Rust 中因为引用和借用，普通引用和智能指针的一个额外的区别是引用是一类只借用数据的指针；相反，在大部分情况下，智能指针
**拥有** 他们指向的数据。

智能指针不同于结构体的地方在于其实现了 `Deref` 和 `Drop` trait。`Deref`
trait 允许智能指针结构体实例表现的像引用一样，这样就可以编写既用于引用、又用于智能指针的代码。`Drop`
trait 允许我们自定义当智能指针离开作用域时运行的代码。

- `Box<T>`，用于在堆上分配值
- `Rc<T>`，一个引用计数类型，其数据可以有多个所有者
- `Ref<T>` 和 `RefMut<T>`，通过 `RefCell<T>` 访问。（ `RefCell<T>`
  是一个在运行时而不是在编译时执行借用规则的类型）。

另外我们会涉及 **内部可变性**（_interior
mutability_）模式，这是不可变类型暴露出改变其内部值的 API。我们也会讨论
**引用循环**（_reference cycles_）会如何泄漏内存，以及如何避免。

## Box\<T\> 创建指向堆的数据

`Box<T>`。box 允许你将一个值放在堆上而不是栈上。留在栈上的则是指向堆数据的指针

用处

- 当有一个在编译时未知大小的类型，而又想要在需要确切大小的上下文中使用这个类型值的时候
- 当有大量数据并希望在确保数据不被拷贝的情况下转移所有权的时候
- 当希望拥有一个值并只关心它的类型是否实现了特定 trait 而不是其具体类型的时候

### 使用box 给递归类型一个已知的大小

![image-20230812205344287](https://raw.githubusercontent.com/susanforme/img/main/img/2023/08/12/20%E6%97%B653%E5%88%8644%E7%A7%926bd3a455a04114472864cc6b35dac6f7-image-20230812205344287-bc49b9.png)

```rust
fn main() {
    // 分配到堆上的值4 的box
    let b = Box::new(5);
    println!("b ={}", b);

    // let list = List::Cons(1, List::Cons(2, List::Cons(3, List::Nil)));
    let list = List::Cons(
        1,
        Box::new(List::Cons(2, Box::new(List::Cons(3, Box::new(List::Nil))))),
    );

    // box离开作用域会被释放
}

// 编译错误 recursive type `List` has infinite size
// enum List {
//     Cons(i32, List),
//     Nil,
// }

// 间接的储存一个指向值的指针。 ：指针的大小并不会根据其指向的数据量而改变
enum List {
    Cons(i32, Box<List>),
    Nil,
}

```

box 只提供了间接存储和堆分配；他们并没有任何其他特殊的功能，比如我们将会见到的其他智能指针。它们也没有这些特殊功能带来的性能损失，所以他们可以用于像 cons
list 这样间接存储是唯一所需功能的场景。我们还将在第十七章看到 box 的更多应用场景。

`Box<T>` 类型是一个智能指针，因为它实现了 `Deref` trait，它允许 `Box<T>`
值被当作引用对待。当 `Box<T>` 值离开作用域时，由于 `Box<T>` 类型 `Drop`
trait 的实现，box 所指向的堆数据也会被清除。这两个 trait 对于在本章余下讨论的其他智能指针所提供的功能中，将会更为重要。让我们更详细的探索一下这两个 trait。

### 通过 Deref trait 将智能指针当作常规引用处理

实现 `Deref` trait 允许我们重载 **解引用运算符**（_dereference
operator_）`*`（不要与乘法运算符或通配符相混淆）。通过这种方式实现 `Deref`
trait 的智能指针可以被当作常规引用来对待，可以编写操作引用的代码并用于智能指针。

让我们首先看看解引用运算符如何处理常规引用，接着尝试定义我们自己的类似 `Box<T>`
的类型并看看为何解引用运算符不能像引用一样工作。我们会探索如何实现 `Deref`
trait 使得智能指针以类似引用的方式工作变为可能。最后，我们会讨论 Rust 的
**Deref 强制转换**（_deref coercions_）功能以及它是如何处理引用或智能指针的。

> 我们将要构建的 `MyBox<T>` 类型与真正的 `Box<T>`
> 有一个很大的区别：我们的版本不会在堆上储存数据。这个例子重点关注
> `Deref`，所以其数据实际存放在何处，相比其类似指针的行为来说不算重要。

```rust
fn main() {
    let x = 5;
    let y = &x;
    assert_eq!(5, x);
    // 解引用
    assert_eq!(5, *y);
    // 引用一样使用box
    let x = 5;
    // y 设置为一个指向 x 值拷贝的 Box<T> 实例，而不是指向 x 值的引用
    let y = Box::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y);
}

```

#### 自定义智能指针

```rust
use std::ops::Deref;
fn main() {
    let x = 5;
    let y = MyBox::new(x);

    assert_eq!(5, x);
    // 底层调用等同于  *(y.deref())
    // Rust 将 * 运算符替换为先调用 deref 方法再进行普通解引用的操作，
    // 外边的普通解引用仍为必须的原因在于所有权。如果 deref 方法直接返回值而不是值的引用，其值（的所有权）将被移出 self。在这里以及大部分使用解引用运算符的情况下我们并不希望获取 MyBox<T> 内部值的所有权。
    assert_eq!(5, *y);

    let m = MyBox::new(String::from("Rust"));
    // Rust 可以通过 deref 调用将 &MyBox<String> 变为 &String
    hello(&m);
    // 如果没有deref (*m) 将MyBox<String> 解引用为String  接着 & 和 [..] 获取了整个 String 的字符串 slice 来匹配 hello 的签名
    hello(&(*m)[..]);
}

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target {
        // 访问元组结构体的第一个元素
        &self.0
    }
}

fn hello(name: &str) {
    println!("hello {name}");
}

```

#### 函数和方法的隐式 Deref 强制转换

**Deref 强制转换**（_deref coercions_）将实现了 `Deref`
trait 的类型的引用转换为另一种类型的引用。例如，Deref 强制转换可以将 `&String`
转换为 `&str`，因为 `String` 实现了 `Deref` trait 因此可以返回
`&str`。Deref 强制转换是 Rust 在函数或方法传参上的一种便利操作，并且只能作用于实现了
`Deref` trait 的类型

## 使用Drop Trait 运行清理代码

对于智能指针模式来说第二个重要的 trait 是
`Drop`，其允许我们在值要离开作用域时执行一些代码。可以为任何类型提供 `Drop`
trait 的实现，同时所指定的代码被用于释放类似于文件或网络连接的资源。

我们在智能指针上下文中讨论 `Drop` 是因为其功能几乎总是用于实现智能指针。例如，当
`Box<T>` 被丢弃时会释放 box 指向的堆空间。

```rust
fn main() {
    let c = CustomSmartPointer {
        data: String::from("my tuff"),
    };
    let d = CustomSmartPointer {
        data: String::from("other stuff"),
    };
    println!("pointers created");
    // 当实例离开作用域 Rust 会自动调用 drop，并调用我们指定的代码。变量以被创建时相反的顺序被丢弃，所以 d 在 c 之前被丢弃。这
}

struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data `{}`!", self.data);
    }
}
```

##### 提早丢弃值

整个 `Drop`
trait 存在的意义在于其是自动处理的。然而，有时你可能需要提早清理某个值。一个例子是当使用智能指针管理锁时；你可能希望强制运行
`drop` 方法来释放锁以便作用域中的其他代码可以获取锁。Rust 并不允许我们主动调用
`Drop` trait 的 `drop` 方法

```rust
fn main() {
    let c = CustomSmartPointer {
        data: String::from("my tuff"),
    };

    println!("CustomSmartPointer created.");
    // 提前清理
    drop(c);
    println!("CustomSmartPointer dropped before the end of main.");
}
```

## Rc\<T\> 引用计数智能指针

为了启用多所有权需要显式地使用 Rust 类型 `Rc<T>`，其为 **引用计数**（_reference
counting_）的缩写。引用计数意味着记录一个值引用的数量来知晓这个值是否仍在被使用。如果某个值有零个引用，就代表没有任何有效引用并可以被清理。

可以将其想象为客厅中的电视。当一个人进来看电视时，他打开电视。其他人也可以进来看电视。当最后一个人离开房间时，他关掉电视因为它不再被使用了。如果某人在其他人还在看的时候就关掉了电视，正在看电视的人肯定会抓狂的！

`Rc<T>`
用于当我们希望在堆上分配一些内存供程序的多个部分读取，而且无法在编译时确定程序的哪一部分会最后结束使用它的时候。如果确实知道哪部分是最后一个结束使用的话，就可以令其成为数据的所有者，正常的所有权规则就可以在编译时生效。

注意 `Rc<T>`
只能用于单线程场景；第十六章并发会涉及到如何在多线程程序中进行引用计数。

### 使用 Rc\<T\> 共享数据

![image-20230813172813733](https://raw.githubusercontent.com/susanforme/img/main/img/2023/08/13/17%E6%97%B628%E5%88%8613%E7%A7%928944153918369da782c28c8cb5a5a682-image-20230813172813733-e24dbe.png)

列表 `a` 包含 5 之后是 10，之后是另两个列表：`b` 从 3 开始而 `c` 从 4 开始。`b`
和 `c` 会接上包含 5 和 10 的列表
`a`。换句话说，这两个列表会尝试共享第一个列表所包含的 5 和 10。

```rust
##![allow(unused_variables)]
// 不在 prelude 中
use std::rc::Rc;

fn main() {
    let a = Rc::new(List::Cons(5, Rc::new(List::Cons(10, Rc::new(List::Nil)))));
    println!("count after creating a = {}", Rc::strong_count(&a));
    // 里会克隆 a 所包含的 Rc<List>，这会将引用计数从 1 增加到 2 并允许 a 和 b 共享 Rc<List> 中数据的所有权
    let b = List::Cons(3, Rc::clone(&a));
    println!("count after creating b = {}", Rc::strong_count(&a));
    {
        // 并不会深拷贝而是增加引用计数类的克隆
        let c = List::Cons(4, Rc::clone(&a));
        println!("count after creating b = {}", Rc::strong_count(&a));
        // Drop trait 的实现当 Rc<T> 值离开作用域时自动减少引用计数。
    }
    println!("count after creating b = {}", Rc::strong_count(&a));
    // a离开作用域 为0
}

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

```

通过不可变引用， `Rc<T>` 允许在程序的多个部分之间只读地共享数据。如果 `Rc<T>`
也允许多个可变引用，则会违反第四章讨论的借用规则之一：相同位置的多个可变借用可能造成数据竞争和不一致。

## RefCell\<T\> 和内部可变性模式

**内部可变性**（_Interior
mutability_）是 Rust 中的一个设计模式，它允许你即使在有不可变引用时也可以改变数据，这通常是借用规则所不允许的。为了改变数据，该模式在数据结构中使用
`unsafe`
代码来模糊 Rust 通常的可变性和借用规则。不安全代码表明我们在手动检查这些规则而不是让编译器替我们检查。

### 通过 RefCell\<T\> 在运行时检查借用规则

借用规则：

1. 在任意给定时刻，只能拥有一个可变引用或任意数量的不可变引用
   **之一**（而不是两者）。
2. 引用必须总是有效的。

对于引用和 `Box<T>`，借用规则的不可变性作用于编译时。对于
`RefCell<T>`，这些不可变性作用于
**运行时**。对于引用，如果违反这些规则，会得到一个编译错误。而对于
`RefCell<T>`，如果违反这些规则程序会 panic 并退出。

如下为选择 `Box<T>`，`Rc<T>` 或 `RefCell<T>` 的理由：

- `Rc<T>` 允许相同数据有多个所有者；`Box<T>` 和 `RefCell<T>` 有单一所有者。
- `Box<T>`
  允许在编译时执行不可变或可变借用检查；`Rc<T>`仅允许在编译时执行不可变借用检查；`RefCell<T>`
  允许在运行时执行不可变或可变借用检查。
- 因为 `RefCell<T>` 允许在运行时执行可变借用检查，所以我们可以在即便
  `RefCell<T>` 自身是不可变的情况下修改其内部的值。

在不可变值内部改变值就是 **内部可变性**
模式。让我们看看何时内部可变性是有用的，并讨论这是如何成为可能的。

### 内部可变性：不可变值的可变借用

```rust
fn main() {
    let x = 5;
    // 编译错误
    let y = &mut x;
}
```

#### 实例

```rust
use std::cell::RefCell;

fn main() {
    it_sends_an_over_75_percent_warning_message();
}

pub trait Messenger {
    fn send(&self, msg: &str);
}

pub struct LimitTracker<'a, T>
where
    T: Messenger,
{
    messenger: &'a T,
    value: usize,
    max: usize,
}

impl<'a, T> LimitTracker<'a, T>
where
    T: Messenger,
{
    pub fn new(messenger: &'a T, max: usize) -> LimitTracker<'a, T> {
        LimitTracker {
            messenger,
            value: 0,
            max,
        }
    }

    pub fn set_value(&mut self, value: usize) {
        self.value = value;
        let percentage_of_max = self.value as f64 / self.max as f64;

        if percentage_of_max >= 1.0 {
            self.messenger.send("Error: You are over your quota!");
        } else if percentage_of_max >= 0.9 {
            self.messenger
                .send("Urgent warning: You've used up over 90% of your quota!");
        } else if percentage_of_max >= 0.75 {
            self.messenger
                .send("Warning: You've used up over 75% of your quota!");
        }
    }
}

struct MockMessenger {
    sent_messages: RefCell<Vec<String>>,
}

impl MockMessenger {
    fn new() -> MockMessenger {
        MockMessenger {
            sent_messages: RefCell::new(vec![]),
        }
    }
}
// 调用 send 并不实际发送 email 或消息，而是只记录信息被通知要发送了。可以新建一个 mock 对象实例，用其创建 LimitTracker，调用 LimitTracker 的 set_value 方法，然后检查 mock 对象是否有我们期望的消息。
impl Messenger for MockMessenger {
    //  send 将能够修改 sent_messages 并储存消息
    //  send 方法的实现，第一个参数仍为 self 的不可变借用
    fn send(&self, msg: &str) {
        self.sent_messages.borrow_mut().push(String::from(msg));
    }
}

fn it_sends_an_over_75_percent_warning_message() {
    let mock_messenger = MockMessenger::new();
    let mut limit_tracker = LimitTracker::new(&mock_messenger, 100);

    limit_tracker.set_value(80);
    // 80超过了75% vector中应该有一条消息
    assert_eq!(mock_messenger.sent_messages.borrow().len(), 1);
}

```

#### RefCell\<T\> 在运行时记录借用

`RefCell<T>` 记录当前有多少个活动的 `Ref<T>` 和 `RefMut<T>` 智能指针。每次调用
`borrow`，`RefCell<T>` 将活动的不可变借用计数加一。当 `Ref<T>`
值离开作用域时，不可变借用计数减一。就像编译时借用规则一样，`RefCell<T>`
在任何时候只允许有多个不可变借用或一个可变借用。

```rust
impl Messenger for MockMessenger {
    fn send(&self, message: &str) {
        let mut one_borrow = self.sent_messages.borrow_mut();
        let mut two_borrow = self.sent_messages.borrow_mut();

        one_borrow.push(String::from(message));
        two_borrow.push(String::from(message));
    }
}

```

#### 结合 Rc\<T\> 和 RefCell\<T\> 来拥有多个可变数据所有者

注意 `RefCell<T>` 不能用于多线程代码！`Mutex<T>` 是一个线程安全版本的
`RefCell<T>`

```rust
use std::{cell::RefCell, rc::Rc};
##[derive(Debug)]
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}
fn main() {
    let value = Rc::new(RefCell::new(5));
    // bc 都可以引用 a
    let a = Rc::new(List::Cons(Rc::clone(&value), Rc::new(List::Nil)));
    let b = List::Cons(Rc::new(RefCell::new(3)), Rc::clone(&a));
    let c = List::Cons(Rc::new(RefCell::new(4)), Rc::clone(&a));
    // 这里使用了第五章讨论的自动解引用功能
    *value.borrow_mut() += 10;

    // 都可以拥有修改后的值15
    println!("a after = {:?}", a);
    println!("b after = {:?}", b);
    println!("c after = {:?}", c);
}

```

## 引用循环与内存泄漏

两个 `List`
值互相指向彼此 创建引用循环的可能性是存在的。这会造成内存泄漏，因为每一项的引用计数永远也到不了 0，其值也永远不会被丢弃

![image-20230814154356756](https://raw.githubusercontent.com/susanforme/img/main/img/2023/08/14/15%E6%97%B643%E5%88%8656%E7%A7%92ecbaf24d8a6979b770c2425bdf681005-image-20230814154356756-5d8aeb.png)

```rust
use std::{cell::RefCell, rc::Rc};

fn main() {
    let a = Rc::new(List::Cons(5, RefCell::new(Rc::new(List::Nil))));
    println!("a initial rc count = {}", Rc::strong_count(&a));
    println!("a next item ={:?}", a.tail());
    let b = Rc::new(List::Cons(10, RefCell::new(Rc::clone(&a))));
    println!("a rc count after b creation = {}", Rc::strong_count(&a));
    println!("b initial rc count = {}", Rc::strong_count(&b));
    println!("b next item = {:?}", b.tail());
    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }
    println!("b rc count after changing a = {}", Rc::strong_count(&b));
    println!("a rc count after changing a = {}", Rc::strong_count(&a));

    // Uncomment the next line to see that we have a cycle;
    // it will overflow the stack
    // println!("a next item = {:?}", a.tail());
}
##[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}
impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            List::Cons(_, item) => Some(item),
            List::Nil => None,
        }
    }
}
```

### 避免引用循环：将 Rc\<T\> 变为 Weak\<T\>

强引用代表如何共享 `Rc<T>` 实例的所有权。弱引用并不属于所有权关系，当 `Rc<T>`
实例被清理时其计数没有影响。他们不会造成引用循环，因为任何弱引用的循环会在其相关的强引用计数为 0 时被打断。

调用 `Rc::downgrade` 时会得到 `Weak<T>` 类型的智能指针。不同于将 `Rc<T>` 实例的
`strong_count` 加 1，调用 `Rc::downgrade` 会将 `weak_count` 加 1。`Rc<T>`
类型使用 `weak_count` 来记录其存在多少个 `Weak<T>` 引用，类似于
`strong_count`。其区别在于 `weak_count` 无需计数为 0 就能使 `Rc<T>` 实例被清理。

#### 创建树

```rust
##![allow(unused)]

use std::{
    cell::RefCell,
    rc::{Rc, Weak},
};

fn main() {
    // 创建后 强引用为1 弱引用为0
    let leaf = Rc::new(Node {
        value: 3,
        children: RefCell::new(vec![]),
        parent: RefCell::new(Weak::new()),
    });
    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf),
    );

    {
        let branch = Rc::new(Node {
            value: 5,
            children: RefCell::new(vec![Rc::clone(&leaf)]),
            parent: RefCell::new(Weak::new()),
        });
        *leaf.parent.borrow_mut() = Rc::downgrade(&branch);
        println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
        println!(
            "branch  strong_count is {} , weak_count is {}",
            Rc::strong_count(&branch),
            Rc::weak_count(&branch)
        );
        println!(
            "leaf strong = {}, weak = {}",
            Rc::strong_count(&leaf),
            Rc::weak_count(&leaf),
        );
    }
    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf),
    );
}
##[derive(Debug)]
struct Node {
    value: i32,
    children: RefCell<Vec<Rc<Node>>>,
    // 父节点应该拥有其子节点：如果父节点被丢弃了，其子节点也应该被丢弃。然而子节点不应该拥有其父节点：如果丢弃子节点，其父节点应该依然存在
    parent: RefCell<Weak<Node>>,
}

```

**并发编程**（_Concurrent programming_），代表程序的不同部分相互独立的执行，而
**并行编程**（_parallel programming_）代表程序不同部分于同时执行

## 使用线程同时运行代码

将程序中的计算拆分进多个线程可以改善性能，因为程序可以同时进行多个任务，不过这也会增加复杂性。因为线程是同时运行的，所以无法预先保证不同线程中的代码的执行顺序。这会导致诸如此类的问题：

- 竞态条件（Race conditions），多个线程以不一致的顺序访问数据或资源
- 死锁（Deadlocks），两个线程相互等待对方，这会阻止两者继续运行
- 只会发生在特定情况且难以稳定重现和修复的 bug

```rust
use std::{thread, time::Duration};

fn main() {
    let v = vec![1, 2, 3];
    // 这个程序的输出可能每次都略有不同
    // move 关键字，我们强制闭包获取其使用的值的所有权
    let handle = thread::spawn(move || {
        // 只会打印到5,主线程结束
        for i in 1..10 {
            println!("hi number {i} from the spawned thread");
            // sleep
            thread::sleep(Duration::from_millis(1));
        }
        println!("here is a vector :{:?}", v);
    });
    // 位置影响输出结果
    // handle.join().unwrap();
    for i in 1..5 {
        println!("hi number {i} form the main thread!",);
        thread::sleep(Duration::from_millis(1));
    }
    // join等待线程结束
    handle.join().unwrap();
}

```

## 使用消息传递在线程间传送数据

消息传递并发，Rust 标准库提供了一个
**信道**（_channel_）实现。信道是一个通用编程概念，表示数据从一个线程发送到另一个线程。

`try_recv` 不会阻塞，相反它立刻返回一个 `Result<T, E>`：`Ok`
值包含可用的信息，而 `Err`
值代表此时没有任何消息。如果线程在等待消息过程中还有其他工作时使用 `try_recv`
很有用：可以编写一个循环来频繁调用
`try_recv`，在有可用消息时进行处理，其余时候则处理一会其他工作直到再次检查。

```rust
use std::{sync::mpsc, thread, time::Duration};

fn main() {
    // mpsc 是 多个生产者，单个消费者（multiple producer, single consumer）的缩写
    // tx 和 rx 通常作为 发送者（transmitter）和 接收者（receiver）的缩写
    let (tx, rx) = mpsc::channel();
    // 通过克隆发送者来创建多个生产者
    let other_tx = tx.clone();
    let start_str = String::from("welcome to channel!");
    let handle = thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        tx.send(start_str).unwrap();
        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
        // 编译失败所有权已转移
        // println!("val is {}", val);
    });
    handle.join().unwrap();
    thread::spawn(move || {
        let vals = vec![
            String::from("more"),
            String::from("messages"),
            String::from("for"),
            String::from("you"),
        ];
        for val in vals {
            other_tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });
    // recv阻塞主进程直到接受到值
    for received in rx {
        println!("Got :{}", received);
    }
}

```

## 共享状态并发

因为需要以某种方式管理这些不同的所有者。Rust 的类型系统和所有权规则极大的协助了正确地管理这些所有权。作为一个例子，让我们看看互斥器，一个更为常见的共享内存并发原语。

### 互斥器一次只允许一个线程访问数据

**互斥器**（_mutex_）是 _mutual exclusion_
的缩写，也就是说，任意时刻，其只允许一个线程访问某些数据。为了访问互斥器中的数据，线程首先需要通过获取互斥器的
**锁**（_lock_）来表明其希望访问数据。锁是一个作为互斥器一部分的数据结构，它记录谁有数据的排他访问权。因此，我们描述互斥器为通过锁系统
**保护**（_guarding_）其数据。

互斥器以难以使用著称，因为你不得不记住：

1. 在使用数据之前尝试获取锁。
2. 处理完被互斥器所保护的数据之后，必须解锁数据，这样其他线程才能够获取锁。

```rust
use std::{
    sync::{Arc, Mutex},
    thread,
};

fn main() {
    // 原子引用计数 Arc<T> 线程安全带有性能惩罚在必要时才为此买单
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            // counter是不可变的,但是提供了内部可变性
            *num += 1;
        });
        handles.push(handle);
    }
    for handle in handles {
        handle.join().unwrap();
    }
    println!("Result: {}", *counter.lock().unwrap());
}

```

## 使用 Sync 和 Send trait 的可扩展并发

### 通过 Send 允许在线程间转移所有权

`Send` 标记 trait 表明实现了 `Send`
的类型值的所有权可以在线程间传送。几乎所有的 Rust 类型都是`Send`
的，不过有一些例外，包括 `Rc<T>`：这是不能 `Send` 的

### Sync 允许多线程访问

`Sync` 标记 trait 表明一个实现了 `Sync`
的类型可以安全的在多个线程中拥有其值的引用。换一种方式来说，对于任意类型
`T`，如果 `&T`（`T` 的不可变引用）是 `Send` 的话 `T` 就是 `Sync`
的，这意味着其引用就可以安全的发送到另一个线程。类似于 `Send` 的情况，基本类型是
`Sync` 的，完全由 `Sync` 的类型组成的类型也是 `Sync` 的

## 特点

### 封装

```rust
fn main() {}

// struct 是公有的 但是字段仍然是私有的
pub struct AveragedCollection {
    list: Vec<i32>,
    average: f64,
}

impl AveragedCollection {
    pub fn add(&mut self, value: i32) {
        self.list.push(value);
        self.update_average();
    }
    pub fn update_average(&mut self) {
        let total: i32 = self.list.iter().sum();
        self.average = (total as f64) / self.list.len() as f64;
    }
    pub fn average(&self) -> f64 {
        self.average
    }
    pub fn remove(&mut self) -> Option<i32> {
        let result = self.list.pop();
        match result {
            Some(r) => {
                self.update_average();
                Some(r)
            }
            None => None,
        }
    }
}

```

### 继承

**继承**（_Inheritance_）是一个很多编程语言都提供的机制，一个对象可以定义为继承另一个对象定义中的元素，这使其可以获得父对象的数据和行为，而无需重新定义。

如果一个语言必须有继承才能被称为面向对象语言的话，那么 Rust 就不是面向对象的。因为没有宏则无法定义一个结构体继承父结构体的成员和方法。

第二个使用继承的原因与类型系统有关：表现为子类型可以用于父类型被使用的地方。这也被称为
**多态**（_polymorphism_），这意味着如果多种对象共享特定的属性，则可以相互替代使用。

当编写库的时候，我们不知道何人会在何时增加 `SelectBox` 类型，不过 `Screen`
的实现能够操作并绘制这个新类型，因为 `SelectBox` 实现了 `Draw`
trait，这意味着它实现了 `draw` 方法。

## 顾及不同类型值的 trait 对象

这个概念 —— 只关心值所反映的信息而不是其具体类型 —— 类似于动态类型语言中称为
**鸭子类型**（_duck
typing_）的概念：如果它走起来像一只鸭子，叫起来像一只鸭子，那么它就是一只鸭子

main.rs

```rust
##![allow(unused)]
use rust_note::{Button, Draw, Screen};

struct SelectBox {
    width: u32,
    height: u32,
    options: Vec<String>,
}

impl Draw for SelectBox {
    fn draw(&self) {
        // code to actually draw a select box
    }
}
fn main() {
    let screen = Screen {
        components: vec![
            Box::new(SelectBox {
                width: 75,
                height: 10,
                options: vec![
                    String::from("Yes"),
                    String::from("Maybe"),
                    String::from("No"),
                ],
            }),
            Box::new(Button {
                width: 50,
                height: 10,
                label: String::from("OK"),
            }),
        ],
    };
    screen.run();
}

```

lib.rs

```rust
pub trait Draw {
    // 抽象
    fn draw(&self);
}
pub struct Screen {
    // trait 对象 Box<dyn Draw> 实现了Draw trait的都可以
    pub components: Vec<Box<dyn Draw>>,
}

pub struct OtherScreen<T: Draw> {
    pub components: Vec<T>,
}

// 使用trait bound
impl<T> OtherScreen<T>
where
    T: Draw,
{
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}

pub struct Button {
    pub width: u32,
    pub height: u32,
    pub label: String,
}

// 可以各自实现
impl Draw for Button {
    fn draw(&self) {
        // draw
    }
}

```

回忆一下第十章
[“泛型代码的性能”](https://kaisery.github.io/trpl-zh-cn/ch10-01-syntax.html#泛型代码的性能)
部分讨论过的，当对泛型使用 trait
bound 时编译器所执行的单态化处理：编译器为每一个被泛型类型参数代替的具体类型生成了函数和方法的非泛型实现。单态化产生的代码在执行
**静态分发**（_static
dispatch_）。静态分发发生于编译器在编译时就知晓调用了什么方法的时候。这与
**动态分发** （_dynamic
dispatch_）相对，这时编译器在编译时无法知晓调用了什么方法。在动态分发的场景下，编译器生成的代码到运行时才能确定调用了什么方法。

当使用 trait 对象时，Rust 必须使用动态分发。编译器无法知晓所有可能用于 trait 对象代码的类型

### trait 对象需要类型安全

如果一个 trait 中定义的所有方法都符合以下规则，则该 trait 是对象安全的：

- 返回值不是 `Self`
- 没有泛型类型的参数

`Self`
关键字是我们在 trait 与方法上的实现的别称，trait 对象必须是对象安全的，因为一旦使用 trait 对象，Rust 将不再知晓该实现的返回类型。如果一个 trait 的方法返回了一个
`Self` 类型，但是该 trait 对象忘记了 `Self`
的确切类型，那么该方法将不能使用原本的类型。当 trait 使用具体类型填充的泛型类型时也一样：具体类型成为实现 trait 的对象的一部分，当使用 trait 对象却忘了类型是什么时，无法知道应该用什么类型来填充泛型类型。

## 面向对象设计模式的实现

**状态模式**（_state
pattern_）是一个面向对象设计模式。该模式的关键在于定义一系列值的内含状态。这些状态体现为一系列的
**状态对象**，同时值的行为随着其内部状态而改变。我们将编写一个博客发布结构体的例子，它拥有一个包含其状态的字段，这是一个有着 "draft"、"review" 或 "published" 的状态对象

这个博客的最终功能看起来像这样：

1. 博文从空白的草案开始。
2. 一旦草案完成，请求审核博文。
3. 一旦博文过审，它将被发表。
4. 只有被发表的博文的内容会被打印，这样就不会意外打印出没有被审核的博文的文本。

##### [为什么不用枚举？](https://kaisery.github.io/trpl-zh-cn/ch17-03-oo-design-patterns.html#为什么不用枚举)

你可能会好奇为什么不用包含不同可能的博文状态的 `enum`
作为变量。这确实是一个可能的方案，尝试实现并对比最终结果来看看哪一种更适合你！使用枚举的一个缺点是每一个检查枚举值的地方都需要一个
`match`
表达式或类似的代码来处理所有可能的成员。这相比 trait 对象模式可能显得更重复。

#### 状态模式

lib

```rust
pub struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    pub fn new() -> Self {
        Post {
            state: Some(Box::new(Draft {})),
            content: String::new(),
        }
    }
    /** 添加字符串 */
    pub fn add_text(&mut self, text: &str) {
        if let true = self.state.as_ref().unwrap().can_edit() {
            self.content.push_str(text);
        } else {
            println!("草稿状态才能添加字符");
        }
    }
    pub fn content(&self) -> &str {
        // as_ref获取值的引用
        // 调用unwrap后 &Box<dyn State> 调用其 content 时，Deref 强制转换
        self.state.as_ref().unwrap().content(self)
    }
    pub fn request_review(&mut self) {
        // 调用 take 方法将 state 字段中的 Some 值取出并留下一个 None
        if let Some(s) = self.state.take() {
            // 而不是使用 self.state = self.state.request_review(); 这样的代码直接更新状态值。这确保了当 Post 被转换为新状态后不能再使用老 state 值。
            self.state = Some(s.request_review())
        }
    }
    pub fn approve(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.approve())
        }
    }
    pub fn reject(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.reject())
        }
    }
}

trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    // 增加默认实现，不过这会违反对象安全性，因为 trait 不知道 self 具体是什么 可以使用宏来消除重复
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn reject(self: Box<Self>) -> Box<dyn State>;
    // 生命周期注解  这里与 post 参数相关。
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
    fn can_edit(&self) -> bool {
        false
    }
}

struct Draft {}
struct PendingReview {}
struct Published {}
impl State for Draft {
    // 这个语法意味着该方法只可在持有这个类型的 Box 上被调用
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        Box::new(PendingReview {})
    }
    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn reject(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn can_edit(&self) -> bool {
        true
    }
}
impl State for PendingReview {
    // 返回自身因为一个正在审核状态的博文调用审核应该还是审核状态
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        // 获取了所有权使得老状态无效化
        self
    }
    fn approve(self: Box<Self>) -> Box<dyn State> {
        Box::new(Published {})
    }
    fn reject(self: Box<Self>) -> Box<dyn State> {
        Box::new(Draft {})
    }
}
impl State for Published {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn content<'a>(&self, post: &'a Post) -> &'a str {
        &post.content
    }
    fn reject(self: Box<Self>) -> Box<dyn State> {
        self
    }
}

```

main

```rust
##![allow(unused)]

use rust_note::Post;

fn main() {
    let mut post = Post::new();

    post.add_text("I ate a salad for lunch today");
    assert_eq!("", post.content());

    post.request_review();
    assert_eq!("", post.content());
    post.add_text("I ate a salad for lunch today");

    post.approve();
    assert_eq!("I ate a salad for lunch today", post.content());
}

```

#### 将状态和行为编码为类型

##### main

```rust
##![allow(unused)]

use rust_note::Post;

fn main() {
    // 不再完全遵守面向对象的状态模式
    let mut post = Post::new();

    post.add_text("I ate a salad for lunch today");
    let post = post.request_review();
    let post = post.approve();
    assert_eq!("I ate a salad for lunch today", post.content());
}

```

##### lib

```rust
pub struct Post {
    content: String,
}

pub struct DraftPost {
    content: String,
}

pub struct PendingReviewPost {
    content: String,
}

impl Post {
    pub fn new() -> DraftPost {
        DraftPost {
            content: String::new(),
        }
    }
    pub fn content(&self) -> &str {
        &self.content
    }
}

impl DraftPost {
    pub fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }
    pub fn request_review(self) -> PendingReviewPost {
        PendingReviewPost {
            content: self.content,
        }
    }
}
impl PendingReviewPost {
    pub fn approve(self) -> Post {
        Post {
            content: self.content,
        }
    }
}

```

## 所有可能会用到模式的位置

### match 分支

`match` 表达式必须是 **穷尽**（_exhaustive_）的，意为 `match`
表达式所有可能的值都必须被考虑到。一个确保覆盖每个可能值的方法是在最后一个分支使用捕获所有的模式：比如，一个匹配任何值的名称永远也不会失败，因此可以覆盖所有匹配剩下的情况。

有一个特定的模式 `_`
可以匹配所有情况，不过它从不绑定任何变量。这在例如希望忽略任何未指定值的情况很有用。本章之后的
[“忽略模式中的值”](https://kaisery.github.io/trpl-zh-cn/ch18-03-pattern-syntax.html#忽略模式中的值)
部分会详细介绍 `_` 模式的更多细节

```
match VALUE {
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
}
```

例如

```rust
fn main() {
    let x = Some(3);
    let x = match x {
        None => None,
        Some(i) => Some(i + 1),
    };
    assert_eq!(4, x.unwrap());
}

```

### if let

```rust
fn main() {
    let favorite_colore: Option<&str> = None;
    let age: Result<u8, _> = "32".parse();
    if let Some(color) = favorite_colore {
        println!("Using your favorite color, {color}, as the background");
    } else if let Ok(a) = age {
        if a > 100 {
            println!("older!");
        } else {
            println!("orange!");
        }
    }
}

```

### while let 条件循环

只要模式匹配就一直进行 `while` 循环

```rust
fn main() {
    let mut stack = vec![];
    stack.push(1);
    stack.push(2);
    stack.push(3);
    while let Some(v) = stack.pop() {
        println!("{v}");
    }
}

```

### for

```rust
fn main() {
    let v = vec!['a', 'b', 'c'];
    //  enumerate 方法适配一个迭代器来产生一个值和其在迭代器中的索引，他们位于一个元组中
    for (index, value) in v.iter().enumerate() {
        println!("{} is at index {}", value, index);
    }
}

```

### let

考虑一下这个直白的 `let` 变量赋值：

```rust
let x = 5;
```

`let` 语句更为正式的样子如下：

```text
let PATTERN = EXPRESSION;
```

使用 `let` 和模式解构一个元组：

```rust
// 数量必须匹配
let (x, y, z) = (1, 2, 3);
```

### 函数参数

```rust
fn main() {
    let point = (3, 5);
    print_coordinates(&point);
}

fn print_coordinates(&(x, y): &(i32, i32)) {
    println!("Current location: ({}, {})", x, y);
}

```

## Refutability（可反驳性）: 模式是否会匹配失效

模式有两种形式：refutable（可反驳的）和 irrefutable（不可反驳的）。能匹配任何传递的可能值的模式被称为是
**不可反驳的**（_irrefutable_）。一个例子就是 `let x = 5;` 语句中的 `x`，因为
`x` 可以匹配任何值所以不可能会失败。对某些可能的值进行匹配会失败的模式被称为是
**可反驳的**（_refutable_）。一个这样的例子便是 `if let Some(x) = a_value`
表达式中的 `Some(x)`；如果变量 `a_value` 中的值是 `None` 而不是 `Some`，那么
`Some(x)` 模式不能匹配。

函数参数、 `let` 语句和 `for`
循环只能接受不可反驳的模式，因为通过不匹配的值程序无法进行有意义的工作。`if let`
和 `while let`
表达式被限制为只能接受可反驳的模式，因为根据定义他们意在处理可能的失败：条件表达式的功能就是根据成功或失败执行不同的操作。

## 所有的模式语法

### 字面值匹配

```rust
fn main() {
    let x = 1;
    match x {
        1 => println!("one"),
        2 => println!("two"),
        _ => println!("anything"),
    }
}

```

### 匹配命名变量

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        // 覆盖变量y
        Some(y) => println!("Matched, y = {y}"),
        _ => println!("Default case, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {y}", x);
}

```

### 多个模式

```rust
fn main() {
    let x = 1;
    match x {
        // 代表或
        1 | 2 => println!("one or two"),
        3 => println!("there"),
        _ => println!("anything"),
    }
}

```

### 匹配值的范围

```rust
fn main() {
    let x = 3;
    match x {
        // ..= 语法允许你匹配一个闭区间范围内的值
        1..=5 => println!("one through five"),
        _ => println!("anything"),
    }
    // 范围只允许用于数字或 char 值。
    let x = 'c';
    match x {
        'a'..='j' => println!("early ASCII"),
        'K'..='z' => println!("late ASCII"),
        _ => println!("something else"),
    }
}

```

### 解构及分解值

```rust
fn main() {
    let p = Point { x: 1, y: 5 };
    let Point { x: a, y: b } = p;
    let Point { x, y } = p;
    assert_eq!(a, 1);
    assert_eq!(x, 1);
    assert_eq!(b, 5);
    assert_eq!(y, 5);
    match p {
        Point { x, y: 0 } => println!("On the x axis at {x}"),
        Point { x: 0, y } => println!("On the y axis at {y}"),
        Point { x, y } => {
            println!("On neither axis: ({x}, {y})");
        }
    }
}

struct Point {
    x: i32,
    y: i32,
}

```

### 嵌套匹配

```rust
##![allow(unused)]

fn main() {
    let msg = Message::ChangeColor(Color::Hsv(0, 160, 255));
    // 嵌套匹配
    let ((feet, inches), Point { x, y }) = ((3, 10), Point { x: 3, y: -10 });
    match msg {
        Message::Quit => {
            println!("The Quit variant has no data to destructure.");
        }
        Message::Move { x, y } => {
            println!("Move in the x direction {x} and in the y direction {y}");
        }
        Message::Write(text) => {
            println!("Text message: {text}");
        }
        // 解构嵌套
        Message::ChangeColor(Color::Rgb(r, g, b)) => {
            println!("Change the color to red {r}, green {g}, and blue {b}",)
        }
        Message::ChangeColor(Color::Hsv(h, s, v)) => {
            println!("Change color to hue {h}, saturation {s}, value {v}")
        }
    };
}

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(Color),
}

enum Color {
    Rgb(i32, i32, i32),
    Hsv(i32, i32, i32),
}

struct Point {
    x: i32,
    y: i32,
}

```

### 忽略模式中的值

`_x` 仍会将值绑定到变量，而 `_` 则完全不会绑定

```rust
##![allow(unused)]
fn main() {
    foo(3, 4);
    let mut setting_value = Some(5);
    let new_setting_value = Some(10);
    // 忽略未使用的变量
    let _x = 5;
    match (setting_value, new_setting_value) {
        (Some(_), Some(_)) => {
            println!("Can't overwrite an existing customized value");
        }
        _ => {
            setting_value = new_setting_value;
        }
    }

    let s = Some(String::from("Hello!"));

    if let Some(_s) = s {
        println!("found a string");
    }
    // 编译错误
    // println!("{:?}", s);
}
// 下划线作为匹配但不绑定任何值的通配符模式了 可作用域函数参数
fn foo(_: i32, y: i32) {
    println!("This code only uses the y parameter: {}", y);
}

```

### 使用..忽略

```rust
fn main() {
    let origin = Point { x: 0, y: 0, z: 0 };
    match origin {
        // .. 模式会忽略模式中剩余的任何没有显式匹配的值部分
        Point { x, .. } => println!("x is {x}"),
    }
    let nums = (1, 2, 3, 4, 5);
    match nums {
        (first, .., last) => {
            println!("some number is {first},{last}");
        }
    }
}

struct Point {
    x: i32,
    y: i32,
    z: i32,
}

```

## 不安全的rust

可以通过 `unsafe`
关键字来切换到不安全 Rust，接着可以开启一个新的存放不安全代码的块。这里有五类可以在不安全 Rust 中进行而不能用于安全 Rust 的操作，它们称之为 “不安全的超能力。（_unsafe
superpowers_）” 这些超能力是：

- 解引用裸指针
- 调用不安全的函数或方法
- 访问或修改可变静态变量
- 实现不安全 trait
- 访问 `union` 的字段

不安全 Rust 有两个被称为 **裸指针**（_raw
pointers_）的类似于引用的新类型。和引用一样，裸指针是不可变或可变的，分别写作
`*const T` 和
`*mut T`。这里的星号不是解引用运算符；它是类型名称的一部分。在裸指针的上下文中，**不可变**
意味着指针解引用之后不能直接赋值。

裸指针与引用和智能指针的区别在于

- 允许忽略借用规则，可以同时拥有不可变和可变的指针，或多个指向相同位置的可变指针
- 不保证指向有效的内存
- 允许为空
- 不能实现任何自动清理功能

```rust
##![allow(unused)]
use std::{slice, thread, time::Duration};

// 全局变量也被称为static变量
// 访问不可变静态变量是安全的

static HELLO_WORLD: &str = "hello world";

// 访问和修改可变静态变量都是 不安全 的
static mut COUNTER: u32 = 0;
fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}
fn main() {
    // 可以在安全代码中 创建 裸指针，只是不能在不安全块之外 解引用 裸指针，。
    let mut num = 5;
    let r1 = &num as *const i32;
    // 可变裸指针
    let r2 = &mut num as *mut i32;
    unsafe {
        println!("r1 is {}", *r1);
        println!("r2 is {}", *r2);
    }
    let address = 0x012345usize;
    let r = address as *mut i32;
    unsafe {
        // 任意访问必定崩溃
        // println!("r is {}", *r);
        // let values: &[i32] = unsafe { slice::from_raw_parts_mut(r, 10000) };
    }
    // 必须在unsafe调用
    unsafe {
        dangerous();
    }

    let mut v = vec![1, 2, 3, 4, 5, 6];

    let r = &mut v[..];

    let (a, b) = split_at_mut(r, 3);

    assert_eq!(a, &mut [1, 2, 3]);
    assert_eq!(b, &mut [4, 5, 6]);

    unsafe {
        println!("Absolute value of -3 according to C: {}", abs(-3));
    }
    add_to_count(3);

    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
    thread::sleep(Duration::from_secs(100));
}

// 不安全的函数
unsafe fn dangerous() {}

// 封装不安全代码
fn split_at_mut<T>(values: &mut [T], mid: usize) -> (&mut [T], &mut [T]) {
    let len = values.len();
    // as_mut_ptr 方法访问 slice 的裸指针
    let ptr = values.as_mut_ptr();
    assert!(mid <= len);
    // 编译失败多次可变借用
    // (&mut values[..mid], &mut values[mid..])
    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

// 调用外部代码
extern "C" {
    fn abs(input: i32) -> i32;
}

// 从其它语言调用 Rust 函数
// 注解来告诉 Rust 编译器不要 mangle 此函数的名称。
// Mangling 发生于当编译器将我们指定的函数名修改为不同的名称时，
// 这会增加用于其他编译过程的额外信息，
##[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Just called a Rust function from C!");
}
// extern 的使用无需 unsafe。

// 实现不安全 trait
unsafe trait Foo {}

unsafe impl Foo for i32 {}

```

## 高级trait

### type

```rust
use std::ops::Add;

fn main() {
    assert_eq!(
        Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
        Point { x: 3, y: 3 }
    );
}

struct Meters(u32);
struct Millimeters(u32);

// new type 模式 将毫米值与米值相加
impl Add<Meters> for Millimeters {
    type Output = Millimeters;
    fn add(self, rhs: Meters) -> Self::Output {
        Millimeters(self.0 + (rhs.0 * 1000))
    }
}

// 自定义运算符行为
##[derive(Debug, Clone, Copy, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

// rhs是默认类型参数
// trait Add<Rhs=Self> {
//     type Output;

//     fn add(self, rhs: Rhs) -> Self::Output;
// }
impl Add for Point {
    type Output = Point;
    fn add(self, rhs: Self) -> Self::Output {
        Point {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}

pub trait Iterator {
    // 关联类型（associated types）是一个将类型占位符与 trait 相关联的方式。
    // 具体实现类型即可
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}

// 泛型需要在每一个实现中定义类型
pub trait GenericIterator<T> {
    fn next(&mut self) -> Option<T>;
}

struct Counter {}

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        Some(2)
    }
}

```

### 完全限定语法与消除歧义

Rust 既不能避免一个 trait 与另一个 trait 拥有相同名称的方法，也不能阻止为同一类型同时实现这两个 trait。甚至直接在类型上实现开始已经有的同名方法也是可能的！

完全限定语法定义为：

```rust
<Type as Trait>::function(receiver_if_method, next_arg, ...);
```

```rust
fn main() {
    let person = Human;
    // 默认调用实现在
    person.fly();
    // 指定调用trait
    Pilot::fly(&person);
    Wizard::fly(&person);

    println!("A baby dog is called a {}", Dog::baby_name());
    // 编译错误 不知道使用那个实现
    // 因为 Animal::baby_name 没有 self 参数，同时这可能会有其它类型实现了 Animal trait
    // println!("A baby dog is called a {}", Animal::baby_name());
    // 完全限定语法
    println!("A baby dog is called a {}", <Dog as Animal>::baby_name());
}

trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}
impl Human {
    fn fly(&self) {
        println!("*waving arms furiously*");
    }
}
trait Animal {
    fn baby_name() -> String;
}

struct Dog;

impl Dog {
    fn baby_name() -> String {
        String::from("Spot")
    }
}

impl Animal for Dog {
    fn baby_name() -> String {
        String::from("puppy")
    }
}

```

### 父 trait 用于在另一个 trait 中使用某 trait 的功能

对于一个实现了第一个 trait 的类型，你希望要求这个类型也实现了第二个 trait。如此就可使 trait 定义使用第二个 trait 的关联项。这个所需的 trait 是我们实现的 trait 的
**父（超）trait**（_supertrait_）。

```rust
use std::fmt;

fn main() {
    let p = Point { x: 1, y: 2 };
    p.outline_print();
}

//  OutlinePrint 需要 Display trait，则可以在 outline_print 中使用 to_string
trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("*{}*", " ".repeat(len + 2));
        println!("* {} *", output);
        println!("*{}*", " ".repeat(len + 2));
        println!("{}", "*".repeat(len + 4));
    }
}
struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({},{})", self.x, self.y)
    }
}

impl OutlinePrint for Point {}

```

### newtype 模式用以在外部类型上实现外部 trait

我们提到了孤儿规则（orphan
rule），它说明只要 trait 或类型对于当前 crate 是本地的话就可以在此类型上实现该 trait。一个绕开这个限制的方法是使用
**newtype 模式**（_newtype pattern_），它涉及到在一个元组结构体（第五章
[“用没有命名字段的元组结构体来创建不同的类型”](https://kaisery.github.io/trpl-zh-cn/ch05-01-defining-structs.html#使用没有命名字段的元组结构体来创建不同的类型)
部分介绍了元组结构体）中创建一个新类型

如果希望新类型拥有其内部类型的每一个方法，为封装类型实现 `Deref` trait（第十五章
[“通过 `Deref` trait 将智能指针当作常规引用处理”](https://kaisery.github.io/trpl-zh-cn/ch15-02-deref.html#通过实现-deref-trait-将某类型像引用一样处理)
部分讨论过）并返回其内部类型是一种解决方案

```rust
use std::fmt;

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("w ={}",w);
}

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}]", self.0.join(","))
    }
}

```

## 高级类型

```rust
fn main() {
    let f: Thunk = Box::new(|| println!("hi"));
}


// 类型别名 鸭子类型
type Kilometers = i32;

// 减少重复
type Thunk = Box<dyn Fn() + Send + 'static>;

fn takes_long_type(f: Thunk) {
    // --snip--
}

// fn returns_long_type() -> Thunk {
//     // --snip--
// }

```

### never type

```rust
// never type 在函数从不返回的时候充当返回值。\
// 不能直接创建
// fn bar() -> ! {}

```

这里的 `guess` 必须既是整型 **也是** 字符串，而 Rust 要求 `guess`
只能是一个类型。那么 `continue`
返回了什么呢？为什么示例 19-26 中会允许一个分支返回 `u32` 而另一个分支却以
`continue` 结束呢？

正如你可能猜到的，`continue` 的值是 `!`。也就是说，当 Rust 要计算 `guess`
的类型时，它查看这两个分支。前者是 `u32` 值，而后者是 `!` 值。因为 `!`
并没有一个值，Rust 决定 `guess` 的类型是 `u32`。

```rust

      let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
```

never type 的另一个用途是 `panic!`。还记得 `Option<T>` 上的 `unwrap`
函数吗？它产生一个值或 panic。这里是它的定义：

```rust
impl<T> Option<T> {
    pub fn unwrap(self) -> T {
        match self {
            Some(val) => val,
            None => panic!("called `Option::unwrap()` on a `None` value"),
        }
    }
}
```

Rust 知道 `val` 是 `T` 类型，`panic!` 是 `!` 类型，所以整个 `match`
表达式的结果是 `T` 类型。这能工作是因为 `panic!`
并不产生一个值；它会终止程序。对于 `None` 的情况，`unwrap`
并不返回一个值，所以这些代码是有效的。

### 动态大小类型和 Sized trait

让我们深入研究一个贯穿本书都在使用的动态大小类型的细节：`str`。没错，不是
`&str`，而是 `str` 本身。`str`
是一个 DST；直到运行时我们都不知道字符串有多长。因为直到运行时都不能知道其大小，也就意味着不能创建
`str` 类型的变量，也不能获取 `str` 类型的参数。考虑一下这些代码，他们不能工作：

```rust
    let s1: str = "Hello there!";
    let s2: str = "How's it going?";
```

Rust 需要知道应该为特定类型的值分配多少内存，同时所有同一类型的值必须使用相同数量的内存。如果允许编写这样的代码，也就意味着这两个
`str`
需要占用完全相同大小的空间，不过它们有着不同的长度。这也就是为什么不可能创建一个存放动态大小类型的变量的原因。

`&str` 则是 **两个** 值：`str` 的地址和其长度。这样，`&str`
就有了一个在编译时可以知道的大小：它是 `usize`
长度的两倍。也就是说，我们总是知道 `&str`
的大小，而无论其引用的字符串是多长。这里是 Rust 中动态大小类型的常规用法：他们有一些额外的元信息来储存动态信息的大小。这引出了动态大小类型的黄金规则：必须将动态大小类型的值置于某种指针之后。

### 高级函数与闭包

### 函数指针

也可以向函数传递常规函数！这个技术在我们希望传递已经定义的函数而不是重新定义闭包作为参数时很有用。函数满足类型
`fn`（小写的 f），不要与闭包 trait 的 `Fn` 相混淆。`fn` 被称为
**函数指针**（_function
pointer_）。通过函数指针允许我们使用函数作为另一个函数的参数。

```rust
##![allow(unused)]
fn main() {
    let answer = do_twice(add_one, 5);
    println!("The answer is: {}", answer);
    let list_of_numbers = vec![1, 2, 3];
    let list_of_strings: Vec<String> = list_of_numbers.iter().map(|i| i.to_string()).collect();

    // 替代闭包
    // 注意这里必须使用 “高级 trait” 部分讲到的完全限定语法，因为存在多个叫做 to_string 的函数
    let list_of_strings: Vec<String> = list_of_numbers.iter().map(ToString::to_string).collect();

    // 以使用这些构造函数作为实现了闭包 trait 的函数指针
    let status: Vec<Status> = (0u32..20).map(Status::Value).collect();
}

enum Status {
    Value(u32),
    Stop,
}

fn add_one(x: i32) -> i32 {
    x + 1
}
// 函数指针 类似闭包
// 是一个类型 而不是trait
// 函数指针实现了所有三个闭包 trait（Fn、FnMut 和 FnOnce）
// 所以总是可以在调用期望闭包的函数时传递函数指针作为参数。
// 倾向于编写使用泛型和闭包 trait 的函数，这样它就能接受函数或闭包作为参数
fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    f(arg) + f(arg)
}

```

## 宏

从根本上来说，宏是一种为写其他代码而写代码的方式，即所谓的
**元编程**（_metaprogramming_）

使用 `macro_rules!` 的 **声明**（_Declarative_）宏，和三种
**过程**（_Procedural_）宏：

- 自定义 `#[derive]` 宏在结构体和枚举上指定通过 `derive` 属性添加的代码
- 类属性（Attribute-like）宏定义可用于任意项的自定义属性
- 类函数宏看起来像函数不过作用于作为参数传递的 token

一个函数签名必须声明函数参数个数和类型。相比之下，宏能够接收不同数量的参数：用一个参数调用
`println!("hello")` 或用两个参数调用 `println!("hello {}", name)`
。而且，宏可以在编译器翻译代码前展开，例如，宏可以在一个给定类型上实现 trait。而函数则不行，因为函数是在运行时被调用，同时 trait 需要在编译时实现。

### 自定义一个vec宏

```rust
// #[macro_export] 注解表明只要导入了定义这个宏的 crate，该宏就应该是可用的。如果没有该注解，这个宏不能被引入作用域。
// 且所定义的宏并 不带 感叹号
##[macro_export]
macro_rules! vec_custom {

  // 简化的vec定义
  // 宏模式所匹配的是 Rust 代码结构而不是值
  // $表示是一个宏变量而不是普通rust变量
  // $() 内则是 $x:expr ，其匹配 Rust 的任意表达式，并将该表达式命名为 $x。
  // 紧随逗号之后的 * 说明该模式匹配零个或更多个 * 之前的任何模式
  // vec![1, 2, 3]; 匹配三次
  // 替换生成后的代码
//   {
//     let mut temp_vec = Vec::new();
//     temp_vec.push(1);
//     temp_vec.push(2);
//     temp_vec.push(3);
//     temp_vec
// }
    ($( $x:expr ),*) => {
        {
          let mut temp_vec = Vec::new();
          $(
            temp_vec.push($x);
          )*
          temp_vec
        }
    };

}

```

### 过程宏

ast

```
DeriveInput {
    // --snip--

    ident: Ident {
        ident: "Pancakes",
        span: #0 bytes(95..103)
    },
    data: Struct(
        DataStruct {
            struct_token: Struct,
            fields: Unit,
            semi_token: Some(
                Semi
            )
        }
    )
}
```

#### 编写自定义宏

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn;

// 指定名称HelloMacro就是 trait 名，
// 相当于把struct传进来了
##[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse(input).unwrap();

    // Build the trait implementation
    impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    // 使用模版来替换
    // 模版#name 会以name来替换
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };
    gen.into()
}

```

### 类函数宏

类函数（Function-like）宏的定义看起来像函数调用的宏。类似于
`macro_rules!`，它们比函数更灵活；例如，可以接受未知数量的参数。然而
`macro_rules!` 宏只能使用之前
[“使用 `macro_rules!` 的声明宏用于通用元编程”](https://kaisery.github.io/trpl-zh-cn/ch19-06-macros.html#使用-macro_rules-的声明宏用于通用元编程)
介绍的类匹配的语法定义。类函数宏获取 `TokenStream`
参数，其定义使用 Rust 代码操纵
`TokenStream`，就像另两种过程宏一样。一个类函数宏例子是可以像这样被调用的 `sql!`
宏：

```rust
let sql = sql!(SELECT * FROM posts WHERE id=1);
```

这个宏会解析其中的 SQL 语句并检查其是否是句法正确的，这是比 `macro_rules!`
可以做到的更为复杂的处理。`sql!` 宏应该被定义为如此：

```rust
##[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
```

这类似于自定义派生宏的签名：获取括号中的 token，并返回希望生成的代码。
