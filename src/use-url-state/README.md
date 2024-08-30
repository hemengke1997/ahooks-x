# [useUrlState](https://ahooks.js.org/zh-CN/hooks/use-url-state)

修复了 `@ahooksjs/use-url-state` 在 vite/remix 中无法使用的问题
1. useUrlState is not a function or its return value is not iterable
2. TypeError: __vite_ssr_import_1__.default is not a function

## 注意事项

使用前请安装
```bash
npm i query-string react-router-dom
```

```json
{
  "peerDependenciesMeta": {
    "react-router-dom": {
      "optional": true
    },
    "query-string": {
      "optional": true
    }
  }
}
```
