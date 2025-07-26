---
date: 2025-07-26
tag:
  - backend
---

# TypeORM

## 前言

TypeORM 是一个可运行在 NodeJS、浏览器、Cordova、PhoneGap 和 Ionic 平台上的对象关
系映射（ORM）框架，并且可以与 TypeScript 和 JavaScript (ES5, ES6, ES7, ES8) 配合
使用。它旨在帮助开发者更轻松、更安全地与数据库进行交互，让你能够使用面向对象的方
式来操作数据库，而不是编写繁琐的原生 SQL 语句。

本指南将带你了解如何使用 TypeORM 完成最基础的数据操作，并重点演示如何实现与原生
SQL 中 `LOCK IN SHARE MODE` 和 `FOR UPDATE` 等效的悲观锁机制。

## 准备工作：环境设置与实体创建

在开始之前，请确保你已经安装了 Node.js 和 TypeScript。

**1. 安装依赖**

首先，我们需要安装 TypeORM 和对应的数据库驱动。我们继续以 MySQL 为例。

```bash
# 安装 TypeORM 核心库
npm install typeorm --save

# 安装数据库驱动，这里使用 mysql2
npm install mysql2 --save

# 安装反射元数据，TypeORM 必须的依赖
npm install reflect-metadata --save

# 安装 TypeScript 和类型定义（如果项目中还没有）
npm install typescript @types/node --save-dev
```

**2. 配置数据源 (DataSource)**

创建一个文件（例如 `data-source.ts`）来配置数据库连接。这是 TypeORM 与数据库沟通
的桥梁。

```typescript
// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_database_name',
  synchronize: true, // 开发时使用，它会自动根据实体创建数据库表。生产环境慎用！
  logging: false, // 可以在控制台打印执行的 SQL 语句
  entities: ['src/entity/**/*.ts'], // 实体文件所在的路径
  migrations: [],
  subscribers: [],
});
```

**3. 创建实体 (Entity)**

实体是一个映射到数据库表的类。我们将使用与之前 MySQL 教程中相同的 `products` 表
结构来创建一个 `Product` 实体。

创建一个文件 `src/entity/Product.ts`：

```typescript
// src/entity/Product.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // @Entity() 装饰器将这个类标记为数据库表实体
export class Product {
  @PrimaryGeneratedColumn() // 主键，并自动增长
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 }) // 定义列类型为 decimal
  price: number;

  @Column('int')
  stock: number;
}
```

## 基础增删改查 (CRUD)

TypeORM 提供了 `Repository` (仓库) 模式来操作实体，极大地简化了 CRUD 操作。

首先，在你的应用代码中初始化数据源并获取 `Product` 的仓库。

```typescript
import { AppDataSource } from './data-source';
import { Product } from './entity/Product';

// 在应用启动时初始化连接
AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');

    // 在这里执行你的数据库操作...
    const productRepository = AppDataSource.getRepository(Product);
    // ...
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
```

### 增 (Create) - `save`

要创建一个新的记录，你需要创建一个实体类的实例，并调用 `save` 方法。

```typescript
// 假设在 AppDataSource.initialize().then() 内部
const product = new Product();
product.name = '机械键盘';
product.price = 899.0;
product.stock = 150;

await productRepository.save(product);
console.log('Saved a new product with id: ' + product.id);
```

### 查 (Read) - `find` 系列方法

TypeORM 提供了多种查询方法。

**查询所有商品:**

```typescript
const allProducts = await productRepository.find();
console.log('All products: ', allProducts);
```

**根据条件查询:** 使用 `findOneBy` 可以方便地按单个条件查找。

```typescript
const laptop = await productRepository.findOneBy({
  name: '笔记本电脑',
});
console.log('Laptop: ', laptop);
```

**使用更复杂的 `where` 条件查询:**

```typescript
import { LessThan } from 'typeorm';

const cheapProducts = await productRepository.findBy({
  price: LessThan(1000), // 查询价格低于 1000 的商品
});
console.log('Cheap products: ', cheapProducts);
```

### 改 (Update) - `save` 或 `update`

如果你有一个 **已存在 ID** 的实体对象，直接调用 `save` 方法即可完成更新。

```typescript
const laptopToUpdate = await productRepository.findOneBy({
  name: '笔记本电脑',
});
if (laptopToUpdate) {
  laptopToUpdate.price = 6888.0; // 修改价格
  await productRepository.save(laptopToUpdate); // 保存更新
  console.log('Laptop updated: ', laptopToUpdate);
}
```

或者，你也可以使用 `update` 方法，这种方式性能更好，因为它不会先查询再更新。

```typescript
// update(criteria, partialEntity)
await productRepository.update({ name: '笔记本电脑' }, { price: 6799.0 });
```

### 删 (Delete) - `remove` 或 `delete`

与更新类似，你可以先找到实体，再用 `remove` 删除。

```typescript
const productToRemove = await productRepository.findOneBy({ id: 3 });
if (productToRemove) {
  await productRepository.remove(productToRemove);
  console.log('Product removed');
}
```

或者，直接通过 `delete` 方法按条件删除，性能更佳。

```typescript
await productRepository.delete(3); // 删除 id 为 3 的记录
```

## 悲观锁：悲观读与悲观写

在高并发场景下，为了保证数据一致性，我们需要使用锁。TypeORM 通过其强大的
**QueryBuilder** 提供了对悲观锁的原生支持。

### 悲观读 (Shared Lock / `LOCK IN SHARE MODE`)

如果你想在读取数据时加上一个共享锁，以防止其他事务修改该数据，但允许它们也进行加
锁读取。

**实现方式：** 使用 `createQueryBuilder` 并调用 `.setLock('pessimistic_read')`。

**场景示例：** 读取商品库存，并在事务处理期间不希望库存被修改。

```typescript
// 此操作必须在事务中执行
await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
  // 使用事务的管理器来创建查询
  const product = await transactionalEntityManager
    .createQueryBuilder(Product, 'product') // "product" 是别名
    .setLock('pessimistic_read') // <-- 设置悲观读锁
    .where('product.id = :id', { id: 2 })
    .getOne();

  console.log('Product with shared lock: ', product);
  // 在这个事务提交前，其他事务不能修改 id=2 的这条记录，但可以同样加读锁来读取。
});
```

这在底层会生成类似 `SELECT ... FROM \`product\` ... WHERE ... LOCK IN SHARE
MODE` 的 SQL 语句。

### 悲观写 (Exclusive Lock / `FOR UPDATE`)

如果你在读取数据后，几乎肯定要对其进行修改，并且希望阻止任何其他事务（包括读取）
的干扰，应该使用排它锁。

**实现方式：** 使用 `createQueryBuilder` 并调用
`.setLock('pessimistic_write')`。

**场景示例：** 经典的扣减库存操作。

```typescript
// 扣减库存也必须是原子操作，放在事务中
await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
  // 1. 加锁查询
  const product = await transactionalEntityManager
    .createQueryBuilder(Product, 'product')
    .setLock('pessimistic_write') // <-- 设置悲观写锁
    .where('product.id = :id', { id: 2 })
    .getOne();

  if (product && product.stock > 0) {
    // 2. 业务逻辑
    console.log(`Current stock is ${product.stock}, preparing to decrement.`);
    product.stock -= 1;

    // 3. 保存更新
    await transactionalEntityManager.save(product);
    console.log(`Stock decremented. New stock is ${product.stock}.`);
  } else {
    console.log('Product not found or out of stock.');
  }
});
```

这在底层会生成类似 `SELECT ... FROM \`product\` ... WHERE ... FOR UPDATE` 的 SQL
语句。

## 总结

- **TypeORM** 通过实体、仓库和数据源等概念，将数据库操作抽象为面向对象的代码，大
  大提高了开发效率和代码可读性。
- **基础 CRUD** 操作通过 `save`, `find`, `update`, `delete` 等方法变得非常直观。
- **悲观锁** 在 TypeORM 中通过 **QueryBuilder** 和 `.setLock()` 方法优雅地实现，
  让你无需编写原生 SQL 就能利用数据库的并发控制能力。
  - `setLock('pessimistic_read')` 对应 **共享锁** (`LOCK IN SHARE MODE`)。
  - `setLock('pessimistic_write')` 对应 **排它锁** (`FOR UPDATE`)。
- 执行加锁操作时，**务必将其包裹在事务中**，这是保证锁的生命周期和操作原子性的关
  键。

通过掌握这些核心功能，你可以使用 TypeORM 构建出既高效又健壮的数据访问层。
