---
description: 基于OpenAPI的ts代码生成
title: 基于 OpenAPI 的 ts 代码生成
pubDate: 2023-09-22
tag:
  - javascript
sticky: 99
---

## 1. 项目概述

本项目是一个高度自动化和可配置的开发工具，其核心使命是解析 OpenAPI (v2/v3) 规范
的 JSON 描述文件，并据此生成功能完整、类型安全的 TypeScript API 客户端代码。通过
将后端 API 的数据结构和接口定义直接转换为前端（或 Node.js 环境）可用的代码，它消
除了手动编写 API 层的大量重复性工作，显著降低了因前后端接口不一致导致的出错风险
，从而极大地提升了开发效率、代码健壮性和可维护性。

## 2. 核心特性

- **双版本兼容**: 无缝支持 **OpenAPI v2 (Swagger)** 和 **OpenAPI v3** 两种主流规
  范，通过优雅的策略模式进行版本适配。
- **全方位类型安全**: 为每一个 API 的请求参数（包括路径参数 `Path`、查询参数
  `Query`、请求体 `Body`）和响应数据 `Response` 生成精确的 TypeScript 类型定义。
- **AST 驱动生成**: 摒弃了脆弱的字符串拼接方式，全面采用 **Babel** 工具链
  （`@babel/parser`, `@babel/types`, `@babel/generator`）在内存中构建和操作代码
  的抽象语法树（AST）。这种方式保证了生成代码的语法绝对正确，并且使得代码结构扩
  展和重构变得异常轻松。
- **深度可配置**: 提供了从输出结构、函数命名、代码风格到请求工具函数等一系列的配
  置选项，能灵活适应不同项目的技术栈和编码规范。
- **智能化服务分组**: 能够自动根据 OpenAPI 文件中的 `tags` 字段或 API 路径，将成
  百上千个接口智能地拆分到不同的服务模块文件中（例如 `UserService.ts`,
  `ProductService.ts`），使得项目结构清晰有序。
- **强大的引用解析**: 集成了业界标准的 `@apidevtools/json-schema-ref-parser` 库
  ，能准确处理复杂的 JSON Schema `$ref` 引用，无论是内部引用还是跨文件的外部引用
  ，都能正确地展开和解析。
- **自动化代码美化**: 内置 **Prettier** 支持，所有生成的代码都会经过格式化，确保
  了最终产物的可读性和风格一致性。
- **强大的兼容性**: 提供 `strict`（严格）模式开关。在非严格模式下，工具能自动识
  别并兼容处理一些后端 Schema 中常见的不规范定义（如无效的 `$ref` 路径），增强了
  在真实项目中的可用性。

## 3. 全流程深度解析

本章节将带领您深入项目的代码实现，一步步揭示从一个 JSON 文件到一个完整的
TypeScript API 代码库的转换过程。我们将遵循 `OpenAPI.run()` 方法的执行路径，对每
一个关键步骤进行详细剖析。

### 3.1 启动与初始化：构造函数 (`constructor`)

一切始于 `new OpenAPI(options)`。构造函数是整个流程的起点，负责初始化实例状态和
配置。

```typescript
// OpenAPI.ts
export class OpenAPI {
  #options: RequiredOptions;
  #services: OpenAPIServicesType = {};
  jsonSchema: Record<string, any>;
  #VersionHandle: VersionType;

  constructor(options: Options) {
    const version = options.version;
    // 1. 根据版本号选择合适的版本处理器
    this.#VersionHandle = this.#getVersionHandleByKey(version);
    // 2. 合并用户配置与默认配置
    this.#options = this.#defineConfig(options);
    this.jsonSchema = {};
  }
```

**代码解析**:

1.  **版本处理器选择 (`#getVersionHandleByKey`)**: 这是实现 OpenAPI v2/v3 兼容性
    的关键第一步。用户的 `options.version` 决定了后续解析 Schema 时所使用的“策略
    ”。

    ```typescript
    // OpenAPI.ts
    #getVersionHandleByKey(version: OPENAPI_VERSION_KEY) {
      switch (version) {
        case OPENAPI_VERSION_KEY.v2:
          return OPENAPI_VERSIONS.v2; // 返回 V2 类
        case OPENAPI_VERSION_KEY.v3:
          return OPENAPI_VERSIONS.v3; // 返回 V3 类
        default:
          throw new Error('版本错误');
      }
    }
    ```

    `this.#VersionHandle` 将会是一个类（`V2` 或 `V3`），后续会通过该类的静态属性
    （如 `COMMON_TYPE_KEY`）来访问不同版本 Schema 中的数据，从而避免了在业务逻辑
    中散落大量的版本判断。

2.  **配置定义 (`#defineConfig`)**: 该方法负责将用户传入的 `options` 与项目预设
    的 `DEFAULT_FIELD_CONFIG` 进行合并，并补全所有可选配置的默认值，最终生成一份
    完整的 `RequiredOptions`。这确保了后续流程中所有配置项都是可用的。

    ```typescript
    // OpenAPI.ts
    #defineConfig(options: Options): RequiredOptions {
      const {
        // ...解构用户传入的配置，并提供默认值
        serviceBanners = [],
        prettierConfig = '',
        fieldConfig = {},
        strict = false,
      } = options;
      return {
        ...options,
        strict,
        // ...补全其他默认值
        fieldConfig: {
          ...DEFAULT_FIELD_CONFIG, // 基础默认配置
          ...fieldConfig,         // 用户自定义配置覆盖默认
        },
      };
    }
    ```

### 3.2 第一阶段：Schema 获取与预处理 (`#handleJSON`)

在 `run()` 方法中，第一步便是调用 `#handleJSON`。此阶段的目标是获取原始的
OpenAPI JSON，并将其清洗、处理成一个标准化的、无外部依赖的内部 `jsonSchema` 对象
。

```typescript
// OpenAPI.ts
async #handleJSON() {
    const { input, strict } = this.#options;
    // 1. 获取 JSON (支持 URL 或本地文件)
    let { jsonSchema } = await getJSON(input);

    // 2. 兼容性处理 (非严格模式下)
    if (!strict) {
      jsonSchema = Utils.replaceErrorRef(jsonSchema);
    }

    // ... 添加文件头注释 ...

    // 3. 核心步骤：捆绑并解析 $ref
    this.jsonSchema = await $RefParser.bundle(
      jsonSchema,
      {
        continueOnError: true,
        // ... parser 配置
      },
    );

    // 4. 路径标准化
    const paths = this.#getPaths();
    const convert = Object.fromEntries(
      Object.entries(paths).map(([key, value]) => {
        return [this.#handlePath(key), value];
      }),
    );
    this.#setPaths(convert);
}
```

**代码解析**:

1.  **获取 JSON**: `getJSON` 是一个工具函数，负责从用户提供的 `input`（URL 或文
    件路径）中读取内容并解析为 JSON 对象。

2.  **兼容性修复**: 在 `strict: false` 模式下，`Utils.replaceErrorRef` 会遍历整
    个 schema，查找并修复一些常见的、不规范的 `$ref` 定义（例如，一个指向
    `#/definitions/Integer` 的引用，但 `Integer` 并非一个合法的对象定义），将其
    替换为 `any` 类型，避免解析器报错。

3.  **捆绑 `$ref`**: 这是此阶段**最重要**的一步。`$RefParser.bundle()` 会递归地
    解析 schema 中所有的 `$ref` 引用。无论是引用本文档的其他部分
    （`#/components/schemas/User`），还是引用其他文件，它都会将这些引用所指向的
    内容拉取过来，并内联到主 schema 中。执行完毕后，`this.jsonSchema` 就成了一个
    完全“自包含”的巨大 JSON 对象，后续处理无需再关心引用的问题。

4.  **路径标准化 (`#handlePath`)**: 很多 OpenAPI 定义中的路径是不包含 `basePath`
    的。此步骤遍历所有 `paths`，并通过用户自定义的 `handlePath` 函数或自动拼接
    `basePath` 的方式，确保所有 API 路径都是完整的、可直接用于请求的 URL 路径。

### 3.3 第二阶段：任务编排与分发 (`#generateAll`)

JSON 准备就绪后，`#generateAll` 方法开始编排真正的代码生成任务。它采用了并发执行
的策略来提升效率。

```typescript
// OpenAPI.ts
async #generateAll() {
    // 1. 清理旧文件
    await this.#removeOldFiles();

    // 2. 对所有 API 进行分组
    this.#tagServicesAndModels();

    const serviceKeys = Object.keys(this.#services);

    // 3. 并发执行生成任务
    await Promise.all([
      // 任务一：为每个 serviceKey 生成对应的服务文件
      ...serviceKeys.map(async (key) => {
        const service = this.#services[key];
        await this.#generateServiceFile(key, service);
      }),
      // 任务二：生成统一的公共类型文件 (types/index.d.ts)
      this.#createResponseType(),
    ]);
}
```

**代码解析**:

1.  **清理旧文件 (`#removeOldFiles`)**: 一个简单的 `fs.rm` 操作，确保每次运行都
    是一次全新的生成。
2.  **API 分组 (`#tagServicesAndModels`)**: 调用此方法，将扁平的 `paths` 列表，
    转换成一个按服务（如 `User`, `Order`）组织的树状结构 `this.#services`。我们
    将在下一节详述其实现。
3.  **并发执行**: 使用 `Promise.all` 将两大类任务并行处理：
    - **服务文件生成**: 每个服务（`User`, `Order` 等）的生成都是一个独立的异步任
      务。如果项目有 10 个服务，这里就会创建 10 个并行的文件生成任务。
    - **公共类型生成**: 所有服务共享的数据模型（通常在 `definitions` 或
      `components.schemas` 中定义）会被提取出来，统一生成到一个文件中。这也是一
      个独立的异步任务。

### 3.4 核心逻辑 (一)：API 服务与模型分组 (`#tagServicesAndModels`)

此方法的职责是将 OpenAPI schema 中扁平的 `paths` 列表，根据一定的规则（通常是
`tags` 或 URL 前缀）进行归类，结果存入 `this.#services` 对象中，为后续按文件生成
代码做准备。

```typescript
// OpenAPI.ts
#tagServicesAndModels() {
    const paths = this.#getPaths();
    const { pathSplitLevel, sameRootLevel } = this.#options;

    Object.entries(paths).forEach(([path, value]) => {
      // 关键工具函数，根据路径和配置计算出服务名
      const pathObj = Utils.urlToCamelCase(
        path,
        pathSplitLevel,
        sameRootLevel,
      );

      const serviceKey = pathObj.camelStr; // 例如 'user' 或 'order'
      const serviceValue = this.#services[serviceKey];
      if (!serviceValue) {
        this.#services[serviceKey] = {};
      }
      // 将当前 path 的所有方法，归入对应的 serviceKey
      this.#services[serviceKey][path] = value;
    });
}
```

**代码解析**:

`Utils.urlToCamelCase` 是这里的核心。假设有以下路径：

- `/api/v1/user/getInfo`
- `/api/v1/user/updateInfo`
- `/api/v1/order/getList`

如果 `pathSplitLevel` 设置为 4，该工具函数会取路径的第四部分 (`user` 或 `order`)
作为 `serviceKey`。最终，`this.#services` 的结构会像这样：

```json
{
  "user": {
    "/api/v1/user/getInfo": { "get": { ... } },
    "/api/v1/user/updateInfo": { "post": { ... } }
  },
  "order": {
    "/api/v1/order/getList": { "get": { ... } }
  }
}
```

这样，后续就可以遍历 `this.#services`，为 `user` 生成 `UserService.ts`，为
`order` 生成 `OrderService.ts`。

### 3.5 核心逻辑 (二)：生成公共类型定义 (`#createResponseType`)

此方法负责创建 `types/index.d.ts` 文件，其中包含了所有接口可能会共享的数据模型
（DTOs/VOs）。

```typescript
// OpenAPI.ts
async #createResponseType() {
    // 1. 获取所有公共模型定义
    const commonTypes = this.#getCommonTypes();
    const commonTypeEntries = Object.entries(commonTypes);
    const body: types.Statement[] = []; // AST 语句数组

    // 2. 遍历每个模型
    commonTypeEntries.forEach(([key, value]) => {
      const name = this.#handleName(key); // 处理名称，使其成为合法的 TS 标识符

      // 3. 将 Schema 转换为 AST
      const { result } = this.#createFlowTypeBySchema({
        ...value,
        name,
      } as any)!;

      // 4. 创建导出的类型别名 AST
      body.push(
        types.exportNamedDeclaration(
          types.typeAlias(
            types.identifier(name),
            null,
            result, // `result` 是从 schema 转换来的类型 AST
          ),
        ),
      );
    });

    // 5. 将 AST 数组写入文件
    await this.#createFileByASTStatement(body, {
      folderPath: 'types',
      fileName: 'index.d.ts',
      banners: this.#fileBanners,
    });
}
```

**代码解析**:

1.  **获取模型**: `this.#getCommonTypes()` 会根据版本（v2/v3）从
    `this.jsonSchema` 中获取 `definitions` 或 `components.schemas` 对象。
2.  **遍历与转换**:
    - 它遍历 `commonTypes` 中的每一个 schema（如 `UserVO`, `ProductDTO`）。
    - `#handleName` 确保模型名称（如 `common-user`）被转换为合法的 TypeScript 标
      识符（`CommonUser`）。
    - 最关键的一步是调用 `#createFlowTypeBySchema`，这个“魔法”函数会将一个 JSON
      Schema 对象递归地转换成一个 Babel 类型 AST 节点。我们将在
      [3.7 节](#37-魔法核心从-schema-到-ast-createflowtypebyschema) 深入探讨它。
3.  **创建导出语句**:
    - `types.typeAlias` 创建一个类型别名，例如 `type UserVO = ...`。
    - `types.exportNamedDeclaration` 将其包装成 `export type UserVO = ...`。
    - 这些 AST 节点被收集到 `body` 数组中。
4.  **写入文件**: 最后，`#createFileByASTStatement` 方法会将整个 `body` AST 数组
    转换成代码字符串并写入文件。

### 3.6 核心逻辑 (三)：生成服务文件 (`#generateServiceFile`) - **(重点)**

这是整个项目中**最复杂、最核心**的方法。它负责为一个服务（如 `UserService`）生成
包含其所有 API 请求函数、参数类型和响应类型的文件。我们将分步解析其内部逻辑。

#### 3.6.1 参数的统一与归类

OpenAPI v2 将所有参数都放在 `parameters` 数组中，而 v3 则引入了 `requestBody` 来
专门描述请求体。为了简化处理逻辑，代码首先将 v3 的 `requestBody` "伪装" 成一个
v2 风格的 `in: 'body'` 参数，从而统一数据结构。

```typescript
// OpenAPI.ts in #generateServiceFile
// 为了统一处理,人工合成一个parameter
if (requestBodySchema) {
	// ... 判断 content-type ...
	parameters.push({
		schema: requestBodySchema,
		in: 'body',
		name: 'single', // name is irrelevant for 'body'
	} as OpenAPIParameter)
}

// 接下来，对所有参数（无论是 v2 原生的还是 v3 伪装的）进行归类
const paramTypeDict: Record<RequestParamType, OpenAPIParameter[]> = {
	query: [],
	path: [],
	body: [],
}

parameters.forEach((currentParameter) => {
	const { in: requestType } = currentParameter
	// 'formData' 和 'body' 都归类到 'body' 中，用于生成请求的 data
	const paramType = requestTypeToParamTypeMap[requestType]
	paramTypeDict[paramType].push(currentParameter)
})
```

执行完毕后，`paramTypeDict` 会像这样，清晰地分离了不同来源的参数：

```json
{
  "query": [ { "name": "page", "in": "query", ... }, { "name": "size", ... } ],
  "path": [ { "name": "id", "in": "path", ... } ],
  "body": [ { "in": "body", "schema": { ... } } ]
}
```

#### 3.6.2 生成请求参数的类型定义

接下来，代码遍历 `paramTypeDict`，为每一类参数（`query`, `body` 等）生成一个专门
的、导出的 TypeScript 类型。

```typescript
// OpenAPI.ts in #generateServiceFile
const parameterTypes = Object.entries(paramTypeDict)
	.filter(([_, value]) => value.length > 0) // 只处理有参数的类别
	.map(([propParamName, parameters]) => {
		const name = propParamName as RequestParamType

		// 1. 调用 #createParamASTByParameter, 内部核心还是 #createFlowTypeBySchema
		const { result, extraImportModules } =
			this.#createParamASTByParameter(parameters)

		// ... 处理导入语句 ...

		// 2. 为这个参数类型生成一个唯一的名字
		const paramIdentifierName = Utils.toBigCamelCase(operationId, paramName) // e.g., GetUserInfoRequestParams

		// 3. 创建导出的类型别名 AST
		const requestParamsType = types.exportNamedDeclaration(
			types.typeAlias(types.identifier(paramIdentifierName), null, result)
		)

		// ... 添加 JSDoc 注释 ...
		return requestParamsType
	})

// ... 在文件末尾，astBody.push(...parameterTypes) 会将这些类型定义加入到文件中
```

**代码解析**: 这段代码的产出是多个 `export type ...` 语句的 AST。例如，对于一个
获取用户信息的接口，可能会生成：

```typescript
/**
 * @description 获取用户信息 Query-String 参数
 */
export type GetUserInfoRequestParams = {
	userId: string
	includeDetails?: boolean
}
```

这些 AST 对象被存储在 `parameterTypes` 数组中，等待最后被写入文件。

#### 3.6.3 构建请求函数声明

现在开始构建核心的请求函数，如 `export function getUserInfo(...)`。

```typescript
// OpenAPI.ts in #generateServiceFile
// operationId 是函数名，如 'getUserInfo'
// outsideRequestBody 是函数参数数组
const body = types.exportNamedDeclaration(
	types.functionDeclaration(
		types.identifier(operationId),
		outsideRequestBody,
		types.blockStatement(outsideFnBlockStatement)
	)
)

// 构建函数的参数
const requestFnParams = types.identifier(
	this.#options.fieldConfig.REQUEST_FN_PARAMS // e.g., 'requestParams'
)

// 为参数对象添加类型注解
requestFnParams.typeAnnotation = types.typeAnnotation(
	types.objectTypeAnnotation(
		outsideRequestParams // outsideRequestParams 是上一步生成的参数属性数组
	)
)

// 如果有参数，则将这个带类型的参数对象添加到函数签名中
if (outsideRequestParams.length > 0) {
	outsideRequestBody.push(requestFnParams)
}
```

**代码解析**: 这里通过 Babel Types 精心构造了函数的声明部分
。`outsideRequestParams` 是一个包含了 `query`, `body` 等属性的类型定义数组，它被
用来注解 `requestFnParams`。最终生成的函数签名会是这样：

```typescript
export function getUserInfo(
    requestParams: {
        query: GetUserInfoRequestParams;
        // 如果有 body, 会有 body: GetUserInfoRequestBody;
    },
    // 还会添加 extraOptions 等额外参数
    extraOptions?: Record<string, any>
) { ... }
```

#### 3.6.4 构建请求函数体与调用表达式

函数体内部的核心是调用一个全局的 `request` 函数。

```typescript
// OpenAPI.ts in #generateServiceFile
// 1. 在函数体内部解构参数
outsideFnBlockStatement.unshift(
    types.variableDeclaration('const', [
        types.variableDeclarator(
            types.objectPattern( ... ), // 从 requestParams 中解构出 query, body 等
            types.identifier(this.#options.fieldConfig.REQUEST_FN_PARAMS),
        ),
    ]),
);

// 2. 构建请求调用表达式
const requestExpression = types.callExpression(
    types.identifier(this.#options.fieldConfig.REQUEST_FN), // e.g., 'request'
    [
        // 参数1: URL (使用模板字符串)
        types.templateLiteral(
            // ... 处理 /users/{id} 这种路径 ...
        ),
        // 参数2: Options 对象
        requestOptions, // 包含 method, query, body, ...extraOptions
    ],
);

// 3. 为调用添加泛型
requestExpression.typeArguments = types.typeParameterInstantiation([
  types.genericTypeAnnotation(
    types.identifier(requestResponseTypeName), // e.g., GetUserInfoResponse
  ),
]);

// 4. return 这个调用
const request = types.returnStatement(requestExpression);
outsideFnBlockStatement.push(request);
```

**代码解析**: 这部分代码构建了函数体内部的逻辑，最终生成的代码如下所示：

```typescript
{
	// 1. 解构
	const { query } = requestParams
	// 2. 返回请求调用
	return request<GetUserInfoResponse>( // 3. 泛型
		`/api/v1/user/info`, // 2.1 URL
		{
			// 2.2 Options
			method: 'GET',
			params: query, // `params` 是由 fieldConfig 配置的
			...extraOptions,
		}
	)
}
```

#### 3.6.5 生成响应类型

与请求参数类似，响应数据也需要一个类型定义。

```typescript
// OpenAPI.ts in #generateServiceFile
const requestResponseTypeName = Utils.toBigCamelCase(operationId, 'response'); // e.g., GetUserInfoResponse

// 1. 调用 #handleResponse 解析 'responses[200].schema'
const resType = this.#handleResponse(value, importStatements[...]);

// 2. 创建导出的类型别名 AST
const requestResponseType = types.exportNamedDeclaration(
    types.typeAlias(
        types.identifier(requestResponseTypeName),
        null,
        resType,
    ),
);
```

`#handleResponse` 方法会定位到 `responses['200'].schema`，如果它是一个 `$ref`，
例如 `"$ref": "#/components/schemas/UserVO"`，它会：

1.  将 `$ref` 路径转换为模型名称 `UserVO`。
2.  将 `UserVO` 添加到需要从 `../types` 导入的模块列表中。
3.  返回一个 `types.genericTypeAnnotation(types.identifier('UserVO'))` 的 AST 节
    点。

最终生成的响应类型定义可能是直接引用公共类型
：`export type GetUserInfoResponse = UserVO;`。

### 3.7 魔法核心：从 Schema 到 AST (`#createFlowTypeBySchema`)

这个私有方法是整个类型生成系统的引擎。它接收一个 JSON Schema 对象，并递归地将其
转换为一个代表 TypeScript 类型的 Babel AST 节点。

#### 3.7.1 递归解析机制

函数内部有一个 `typeMap` 对象，它像一个调度中心，根据 schema 的 `type` 字段
（`'object'`, `'string'`, `'array'`等）来调用不同的处理函数。

```typescript
// OpenAPI.ts
#createFlowTypeBySchema(inputSchema?: OpenAPISchema): { ... } {
    if (inputSchema) {
        const { type, ... } = inputSchema;

        // typeMap 是一个代理，可以根据 type 调用对应的方法
        const typeMap: Record<ParamType, () => types.FlowType> = new Proxy({
            integer() { return this.number(); },
            number() { /* ... */ },
            object() { /* ... */ },
            string() { /* ... */ },
            array() { /* ... */ },
            // ...
        }, { /* ... */ });

        // ...

        // 根据 schema 的 type 调用对应方法
        return {
            result: typeMap[type](),
            extraImportModules,
        };
    }
    return { result: types.anyTypeAnnotation() };
}
```

#### 3.7.2 处理 `object` 类型

当 `type` 为 `'object'` 时，代码会遍历其 `properties`。

```typescript
// OpenAPI.ts in #createFlowTypeBySchema
object() {
    if (properties) {
        const allProperties = Object.entries(properties).map(([key, property]) => {
            // 1. 递归调用自身，处理属性的 schema
            const { result, extraImportModules: propsImports = [] } =
                openAPIThis.#createFlowTypeBySchema({ ...property });

            // ... 收集需要导入的模块 ...

            // 2. 创建对象属性的 AST
            const propertyType = types.objectTypeProperty(
                types.stringLiteral(key),
                result,
            );

            // 3. 根据 'required' 数组判断属性是否可选
            propertyType.optional = !required?.includes(key);

            // 4. 为属性添加注释
            return openAPIThis.#generateComments(propertyType, ...);
        });

        // 5. 返回包含所有属性的 object 类型注解
        return types.objectTypeAnnotation(allProperties);
    }
    // ... 处理 additionalProperties 等其他情况
    return types.anyTypeAnnotation();
}
```

这个过程将一个描述对象的 schema 转换成一个 `{ key1: type1; key2?: type2; }` 形式
的 AST。

#### 3.7.3 处理 `array` 类型

当 `type` 为 `'array'` 时，代码会解析其 `items` 属性。

```typescript
// OpenAPI.ts in #createFlowTypeBySchema
array() {
    if (items) {
        // 1. 递归调用自身，处理数组成员的 schema
        const { result, ... } = openAPIThis.#createFlowTypeBySchema({ ...items });

        // 2. 返回数组类型注解，形如 Type[]
        return types.arrayTypeAnnotation(result);
    }
    return types.arrayTypeAnnotation(types.anyTypeAnnotation()); // any[]
}
```

#### 3.7.4 处理 `$ref` 引用

当一个 schema 片段没有 `type` 但有 `$ref` 时（或者在 `properties` 中遇到
`$ref`），它表示一个引用。

```typescript
// OpenAPI.ts in #createFlowTypeBySchema
if (!type) {
	if ($ref && !properties) {
		// 1. 将 '#/components/schemas/UserVO' 转换为 'UserVO'
		const typeName = this.#handleName(this.#transform$RefToOriginalRef($ref))

		// 2. 创建一个泛型类型注解，即类型标识符
		const result = types.genericTypeAnnotation(types.identifier(typeName))

		// 3. 记录下来，这个 'UserVO' 需要从外部导入
		extraImportModules.push(typeName)

		return { result, extraImportModules }
	}
}
```

这确保了模型之间的引用关系被正确地转换为 TypeScript 中的类型引用和 `import` 语句
。

### 3.8 收尾阶段：从 AST 到文件 (`#createFileByASTStatement`)

这是所有 AST 构建工作的最后一站。此方法接收一个 AST 语句数组，将其转换为最终的代
码并写入磁盘。

```typescript
// OpenAPI.ts
async #createFileByASTStatement(body: types.Statement[], options: { ... }) {
    // 1. 创建一个空的 AST 根节点
    const ast = BabelParse.parse('', {
      sourceType: 'module',
      plugins: ['typescript'],
    });

    // 2. 将所有生成的语句 AST 添加到根节点的 program.body 中
    ast.program.body.push(...body);

    // 3. 使用 @babel/generator 将 AST 转换成代码字符串
    let tsCode = generator(ast, {}).code;

    // 4. 添加头部注释
    tsCode = banners.join('\n') + tsCode + footers.join('\n');

    // ... 创建输出目录 ...

    // 5. 使用 Prettier 格式化代码，然后写入文件
    await fs.writeFile(
      // ... 文件路径 ...
      await this.#formatCode(tsCode),
      { encoding: 'utf-8', flag: 'w+' },
    );
}
```

**代码解析**: `@babel/generator` 是 Babel 工具链的“打印机”，它接收一个完整的
AST，然后输出一个格式优美的代码字符串。随后，`#formatCode` 方法调用
`prettier.format` 对这段代码进行终极美化，确保了代码风格的统一。最后
，`fs.writeFile` 完成物理写入。

## 4. 版本适配策略：`V2` 与 `V3` 的优雅兼容

如前所述，本项目没有在业务逻辑中硬编码版本判断，而是采用了一种优雅的策略模式。

`version.ts` 定义了抽象基类和类型：

```typescript
// constants/version/version.ts
export abstract class Version {
	static PATHS_KEY_PATH: string[]
	static COMMON_TYPE_KEY: string[]
	static METHOD_SUCCESS_RESPONSE_KEY: string[]
	// ... 其他关键路径的定义
}
export type VersionType = typeof Version
```

`V2.ts` 和 `V3.ts` 提供了具体的实现：

```typescript
// constants/version/V2.ts
export class V2 extends BaseVersion {
	static override COMMON_TYPE_KEY = ['definitions'] // v2 的模型在 definitions
	static override METHOD_SUCCESS_RESPONSE_KEY = ['responses', '200', 'schema']
}

// constants/version/V3.ts
export class V3 extends BaseVersion {
	static override COMMON_TYPE_KEY = ['components', 'schemas'] // v3 的模型在 components.schemas
	static override METHOD_SUCCESS_RESPONSE_KEY = [
		'responses',
		'200',
		'content',
		WILD_CARD,
		'schema',
	]
}
```

在 `OpenAPI` 类中，所有需要访问这些路径的地方，都通过 `this.#VersionHandle` 的静
态属性来访问，而不是直接使用字符串数组。例如：

```typescript
// OpenAPI.ts
#getCommonTypes() {
    // 无需判断版本，直接使用策略对象的属性
    return Utils.get(this.jsonSchema, this.#VersionHandle.COMMON_TYPE_KEY);
}
```

这种设计使得主逻辑与版本细节解耦，未来如果需要支持 OpenAPI v4，只需新增一个
`V4.ts` 文件，而无需改动 `OpenAPI.ts` 中的核心逻辑。

## 5. 配置系统详解

配置系统是该工具灵活性的保障，核心是 `Options` 类型和 `fieldConfig`。

```typescript
// types.ts
export type Options = {
	input: string
	output: string
	version: OPENAPI_VERSION_KEY
	// ... 其他配置
	fieldConfig: Partial<FieldConfigType>
}

export type FieldConfigType = {
	REQUEST_FN_PARAMS: string // 函数的参数对象名，默认 'requestParams'
	REQUEST_BODY: string // 解构出的请求体变量名，默认 'data'
	QUERY_STRING_PARAMETERS: string // 解构出的查询参数变量名，默认 'params'
	PATH_PARAMETERS: string // 解构出的路径参数变量名，默认 'path'
	REQUEST_FN: string // 调用的全局请求函数名，默认 'request'
	COMMON_TYPE_PATH: string // 公共类型文件的相对路径
	// ...
}
```

通过修改 `fieldConfig`，用户可以轻松地让生成的代码适配任何现有的请求库。例如，如
果你的项目使用 antd-request，其查询参数字段是 `params`，请求体是 `data`，那么使
用默认配置即可。如果你的请求库要求查询参数字段是 `query`，请求体是 `body`，只需
如下配置：

```javascript
// 在调用时传入
const generator = new OpenAPI({
	// ...
	fieldConfig: {
		QUERY_STRING_PARAMETERS: 'query',
		REQUEST_BODY: 'body',
	},
})
```

工具就会生成 `const { query, body } = requestParams;` 以及在 `request` 调用中传
入 `query` 和 `body` 字段。
