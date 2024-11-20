# use-preload-images

## 介绍

预加载图片。可以避免图片hover时的闪烁。

支持静态src，也支持Promise

## 使用方法

```tsx
import { usePreloadImages } from 'ahooks-x'
import imageHover from './image-hover.png'

function App() {
  usePreloadImages([imageHover, () => import('./image.png').then((mod) => mod.default)])
}
```
