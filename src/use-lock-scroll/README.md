# useLockScroll

## 使用

```ts
import { useState } from 'react'
import { useLockScroll } from 'ahooks-x'

const [lock, setLock] = useState(false)

useLockScroll(lock, window.body)
```
