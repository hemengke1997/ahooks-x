# useStrictInput

## 介绍

用于处理输入框输入的 React Hook，可以限制输入格式

## 使用方法

```tsx
import { useStrictInput } from 'ahooks-x'

function App() {
  const [value, setValue] = useState()
  const events = useStrictInput({
    value,
    onChange: setValue,
  })

  return <input {...events} value={value} />
}
```
