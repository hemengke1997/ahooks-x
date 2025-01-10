# use-imperative-antd-modal

## 介绍

命令式灵活使用 antd 的 Modal 组件，可动态传入组件 Props

## 使用方法

```tsx
import { useImperativeAntdModal } from 'ahooks-x'

function Component(props: {
  title: string
  content: string
}) {
  return <div>
    <h1>{props.title}</h1>
    <p>{props.content}</p>
  </div>
}

function App() {
  const { showModal } = useImperativeAntdModal({
    FC: Component,
  })

  return <button onClick={() => {
    showModal({
      title: '标题',
      content: '内容'
    }, {
      width: 300
    })
  }}>打开modal</button>
}
```
