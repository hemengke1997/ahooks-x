# useControlledState

## 介绍

受控state

## 使用方法

```tsx
import { useControlledState } from 'ahooks-x'

type Props<T> = {
  value: T
  onChange: (value: T) => void
}

function ControlledComponent<T>(props: Props<T>) {
  const [value, setValue] = useControlledState({
    defaultValue: props.value,
    value: props.value,
    onChange: props.onChange
  })
}
```
