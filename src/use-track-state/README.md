# useTrackState

## 介绍

追踪依赖状态变化，当依赖变化后，重新获取状态

## 使用方法

```tsx
import { useTrackState } from 'ahooks-x'

function App(props: {
  needTrackState: unknown
}) {
  const [tracedState, setTrackdState] = useTrackState(props.needTrackState) // 总是追踪 needTrackState 的变化
}
```
