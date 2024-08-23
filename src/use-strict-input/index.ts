import { useMemoizedFn } from 'ahooks'
import { useRef } from 'react'
import { useControlledState } from '../use-controlled-state'

type Options = {
  value: string
  onChange: (v: string) => void
  /**
   * default treat input as `Number`
   * @default /\D/g
   */
  strict?: RegExp
}

function useStrictInput(options: Options) {
  const { strict = /\D/g } = options
  const [value, setValue] = useControlledState({
    defaultValue: options.value,
    value: options.value,
    onChange: options.onChange,
  })

  const composedRef = useRef(false)

  const onCompositionStart: React.CompositionEventHandler<HTMLInputElement> = useMemoizedFn(() => {
    composedRef.current = true
  })

  const onCompositionEnd: React.CompositionEventHandler<HTMLInputElement> = useMemoizedFn(() => {
    composedRef.current = false
    setValue(value?.replace(strict, ''))
  })

  const onChange = useMemoizedFn((value: string) => {
    let v = value

    if (!v) {
      setValue(v)
      return v
    }

    if (!composedRef.current) {
      v = value?.replace(strict, '')
    }

    setValue(v)
    return v?.replace(strict, '')
  })

  return {
    onCompositionStart,
    onCompositionEnd,
    onChange,
  }
}

export { useStrictInput }
