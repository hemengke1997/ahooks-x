/* eslint-disable react-hooks/rules-of-hooks */

import { createElement, Fragment, type FunctionComponent, type ReactElement, useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import { isBrowser } from '../utils'
import { render as reactRender } from './render'

type ConfigUpdate<T> = T | ((prev: T) => T)

type Config<T> = {
  keys?: {
    /**
     * 显隐 key
     */
    open?: keyof T
    /**
     * 关闭弹窗key
     */
    onClose?: keyof T
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
  config?: Config<T>,
) {
  if (!isBrowser()) {
    return {
      close: () => {},
      update: () => {},
      open: () => {},
    }
  }

  const { keys, render: _render } = config || {}
  const { open: openKey = 'open', onClose: onCloseKey = 'onCancel' } = keys || {}

  const currentProps = useRef({ [openKey]: true } as T)
  let timeoutId: ReturnType<typeof setTimeout>
  const container = useRef(document.createDocumentFragment())

  const render = useMemoizedFn((props: T) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      const element = createElement(FC, {
        ...props,
        __key__: Math.random().toString(36),
      } as T)

      reactRender(<Fragment>{_render ? _render(element) : element}</Fragment>, container.current)
    })
  })

  const open = useMemoizedFn((props: T) => {
    currentProps.current = {
      ...props,
      [openKey]: true,
      [onCloseKey]: close,
    }
    render(currentProps.current)
  })

  const close = useMemoizedFn(() => {
    const props = {
      ...currentProps.current,
      [openKey]: false,
    }

    render(props)
  })

  const update = useMemoizedFn((configUpdate: ConfigUpdate<T>) => {
    if (typeof configUpdate === 'function') {
      currentProps.current = configUpdate(currentProps.current)
    } else {
      currentProps.current = {
        ...currentProps.current,
        ...configUpdate,
      }
    }
    render(currentProps.current)
  })

  return {
    close,
    update,
    open,
  }
}

export { useImperative }
