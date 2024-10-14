# use-imperative

## 介绍

把声明式组件转为命令式组件

## 使用方法

```tsx
import { useImperative } from 'ahooks-x'
import { Modal, type ModalProps } from 'antd'

function MyModal(props: ModalProps & {
  yourProp: string
}) {
  return <Modal {...props}></Modal>
}

function App() {
  const { open } = useImperative(MyModal)

  return <button onClick={() => {
    open({
      title: '标题',
      yourProp: '你的属性'
    })
  }}>打开modal</button>
}
```
