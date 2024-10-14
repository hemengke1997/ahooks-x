import { createElement, Fragment, type FunctionComponent, type ReactElement } from 'react'
import { useMemoizedFn } from 'ahooks'
import { isBrowser } from '../utils/is'
import { render as reactRender } from './render'

type ConfigUpdate<T> = T | ((prev: T) => T)

type Config<T> = {
  keys?: {
    /**
     * 显隐 key
     */
    open?: keyof T
  }
  render?: (children: ReactElement) => ReactElement
}

/**
 * @description 把显隐的声明式tsx转换为命令式
 * 如 antd 的 Modal
 * 如 vant 的 Dialog
 */
function useImperative<T extends Record<string, any> = Record<string, any>>(
  FC: FunctionComponent<T>,
  config: Config<T>,
) {
  const { keys, render: _render } = config || {}
  const { open: openKey = 'open' } = keys || {}

  let currentProps = { [openKey]: true } as T
  let timeoutId: ReturnType<typeof setTimeout>

  const render = useMemoizedFn((props: T) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      const element = createElement(FC, {
        ...props,
      } as T)
      reactRender(<Fragment>{_render ? _render(element) : element}</Fragment>, document.createDocumentFragment())
    })
  })

  const open = useMemoizedFn((props: T) => {
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

  if (!isBrowser()) {
    return {
      close: () => {},
      update: () => {},
      open: () => {},
    }
  }

  return {
    close,
    update,
    open,
  }
}

export { useImperative }
