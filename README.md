# @codegenius/clear-plugin

## 安装

```bash
npm i @codegenius/clear-plugin
```

```javascript
// 开发期间使用
import { defineConfig } from "code-genius";
import clearInstaller from "@codegenius/clear-plugin";

export default defineConfig({
  plugins: [
    clearInstaller({
      files: ["./src"],
    }),
  ],
});
```

## 使用

运行 `rimraf` 删除不再需要的文件或文件夹, 支持命令模式, 询问模式和 **API** 模式;

使用场景: 用于删除可以通过项目运行自动生成的文件, 如: `dist` 目录, 还有顽固的 `node_modules`.

### 命令模式

```bash
# 删除 dist 文件夹
codeg clear -p ./dist

# 删除 dist 和 node_modules 两个文件夹
codeg clear -p ./dist -p ./node_modules
```

| 选项                      | 描述         |
| ------------------------- | ------------ |
| -p, --pattern \<pattern\> | 设置匹配规则 |
| -a, --ask                 | 启用询问模式 |

### 询问模式

```bash
# 启动询问模式
codeg clear --ask
```

```
# 询问过程
1. 请选择需要清理的文件/夹
```

### API 模式

```typescript
import { clear } from "code-genius";

(async () => {
  await clear(["./dist"]);
})();
```

### 配置文件

```typescript
# 覆盖默认的 `files` 配置
import { defineConfig } from "code-genius";

export default defineConfig({
  commands: {
    clear: {
      files: ["./dist"]
    },
  },
});
```
