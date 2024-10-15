# useTraceState

## 介绍

追踪依赖状态变化，当依赖变化后，重新获取状态

## 使用方法

```tsx
import { useTraceState } from 'ahooks-x'

function Component(props: {
  needTraceState: unknown
}) {
  const [tracedState, setTracedState] = useTraceState(props.needTraceState) // 总是追踪 needTraceState 的变化
}
```
