import { createElement, type FunctionComponent, useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import { isBrowser } from '../utils/is'
import { render as reactRender } from './render'

type ConfigUpdate<T> = T | ((prev: T) => T)

type Config<T> = {
  /**
   * @description 声明式组件
   */
  RC: FunctionComponent<T>
  keys: {
    /**
     * 显隐 key
     */
    open: keyof T
  }
}

/**
 * @description 把显隐的声明式tsx转换为命令式
 * 如 antd 的 Modal
 * 如 vant 的 Dialog
 */
function useImperative<T extends Record<string, any> = Record<string, any>>(config: Config<T>) {
  if (!isBrowser()) {
    return {
      close: () => {},
      update: () => {},
      show: () => {},
    }
  }

  const {
    RC,
    keys: { open: openKey },
  } = config

  const container = useRef(document.createDocumentFragment()).current

  let currentProps = { [openKey]: true } as T
  let timeoutId: ReturnType<typeof setTimeout>

  const render = useMemoizedFn((props: T) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      reactRender(
        createElement(RC, {
          ...props,
        } as T),
        container,
      )
    })
  })

  const show = useMemoizedFn((props: T) => {
    currentProps = {
      ...props,
      [openKey]: true,
    }
    render(currentProps)
  })

  const close = useMemoizedFn(() => {
    const props = {
      ...currentProps,
      [openKey]: false,
    }
    render(props)
  })

  const update = useMemoizedFn((configUpdate: ConfigUpdate<T>) => {
    if (typeof configUpdate === 'function') {
      currentProps = configUpdate(currentProps)
    } else {
      currentProps = {
        ...currentProps,
        ...configUpdate,
      }
    }
    render(currentProps)
  })

  return {
    close,
    update,
    show,
  }
}

export { useImperative }
