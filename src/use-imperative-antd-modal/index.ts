import { createElement, type DependencyList, useState } from 'react'
import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { App, type ModalFuncProps } from 'antd'
import { type HookAPI } from 'antd/es/modal/useModal'

export type ImperativeModalProps = {
  closeModal: () => void
}

export const imperativeModalMap: Map<string, ReturnType<HookAPI['confirm']>> = new Map()

function randomId() {
  return Math.random().toString(36).substring(2)
}

export function useImperativeAntdModal<T extends object>(props: {
  FC: React.ComponentType<T>
  id?: string
  modalProps?: ModalFuncProps
  deps?: DependencyList
}) {
  const { FC, modalProps: initialModalProps, id: idProp, deps } = props
  const { modal } = App.useApp()

  const [current, setCurrent] = useState<{
    id: string
    props: ((modalProps: ModalFuncProps | undefined) => ModalFuncProps) | undefined
  }>({
    id: idProp || '',
    props: undefined,
  })

  const onClose = useMemoizedFn((id: string) => {
    imperativeModalMap.delete(id)
  })

  const showModal = useMemoizedFn((componentProps: T, modalProps?: ModalFuncProps) => {
    const id = idProp || randomId()

    const props = (initialModalProps: ModalFuncProps | undefined): ModalFuncProps => ({
      ...initialModalProps,
      ...modalProps,
      afterClose() {
        onClose(id)
        modalProps?.afterClose?.()
      },
      content: createElement(FC, {
        ...componentProps,
        closeModal: () => {
          const instance = imperativeModalMap.get(id)
          instance?.destroy()
          onClose(id)
        },
      } as T),
    })

    const instance = modal.confirm(props(initialModalProps))

    setCurrent({ id, props })
    imperativeModalMap.set(id, instance)

    return instance
  })

  useUpdateEffect(() => {
    if (current.id) {
      const instance = imperativeModalMap.get(current.id)
      instance?.update(current.props?.(initialModalProps) || {})
    }
  }, [...(deps || []), initialModalProps])

  return {
    showModal,
    id: current.id,
    imperativeModalMap,
  }
}
