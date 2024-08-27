# use-imperative

## 介绍

把声明式组件转为命令式组件

## 使用方法

```tsx
import { useImperative } from '@minko-fe/react-hook'
import { Modal, type ModalProps } from 'antd'

function MyModal(props: ModalProps) {
  return <Modal {...props}></Modal>
}

function App() {
  const { show } = useImperative(MyModal, {
    keys: {
      open: 'open'
    }
  })

  return <button onClick={() => {
    show({
      title: '标题',
    })
  }}>打开modal</button>
}
```
