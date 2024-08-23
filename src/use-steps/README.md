# useSteps

## 介绍

在多个步骤中切换。如果当前步骤是最后一个步骤，则下一个步骤将是第一个步骤

## 使用方法

```tsx
import { useSteps } from '@minko-fe/react-hook'

const [currentStep, next] = useSteps({
  steps: ['step1', 'step2', 'step3'],
  initialStep: 'step1',
})
```
