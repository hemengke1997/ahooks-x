import { type ComponentType, createElement, type DependencyList, startTransition, useMemo, useRef } from 'react'
import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { App, type ModalFuncProps } from 'antd'
import { type HookAPI } from 'antd/es/modal/useModal'
import { isLazyComponent } from '@/utils'

export type ImperativeModalProps = {
  closeModal: () => void
}

export const imperativeModalMap: Map<string, ReturnType<HookAPI['confirm']>> = new Map()

function randomId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36).slice(-2)
}

export function useImperativeAntdModal<T extends object>(props: {
  FC: ComponentType<T>
  id?: string
  modalProps?: ModalFuncProps
  /**
   * @description 是否允许打开多个modal
   * @default false
   */
  multiple?: boolean
  /**
   * @description modal刷新依赖
   */
  deps?: DependencyList
}) {
  const { FC, modalProps: initialModalProps, id: idProp, multiple = false, deps } = props
  const { modal } = App.useApp()

  const initialModalDetails = useMemo(
    () => ({
      id: idProp || '',
      props: undefined,
      instance: undefined,
    }),
    [idProp],
  )

  const modalDetails = useRef<{
    id: string
    props: ((modalProps: ModalFuncProps | undefined) => ModalFuncProps) | undefined
    instance: ReturnType<HookAPI['confirm']> | undefined
  }>(initialModalDetails)

  const onClose = useMemoizedFn((id: string) => {
    const instance = imperativeModalMap.get(id)
    instance?.destroy()
    imperativeModalMap.delete(id)
  })

  const showModal = useMemoizedFn(
    (componentProps: Omit<T, keyof ImperativeModalProps>, modalProps?: ModalFuncProps) => {
      if (!multiple && imperativeModalMap.get(modalDetails.current.id)) {
        return
      }

      const id = idProp || randomId()

      const props = (initialModalProps: ModalFuncProps | undefined): ModalFuncProps => {
        const mergedProps = {
          ...initialModalProps,
          ...modalProps,
        }
        return {
          ...mergedProps,
          afterClose() {
            onClose(id)
            mergedProps?.afterClose?.()
          },
          content: createElement(FC, {
            ...componentProps,
            closeModal: () => {
              onClose(id)
            },
          } as T),
        }
      }

      const instance = modal.confirm(props(initialModalProps))

      modalDetails.current = {
        id,
        props,
        instance,
      }
      imperativeModalMap.set(id, instance)

      return instance
    },
  )

  const showModalWithLazy: typeof showModal = useMemoizedFn((...args) => {
    let result
    startTransition(() => {
      result = showModal(...args)
    })
    return result
  })

  useUpdateEffect(() => {
    if (modalDetails.current.id) {
      const instance = imperativeModalMap.get(modalDetails.current.id)
      instance?.update(modalDetails.current.props?.(initialModalProps) || {})
    }
  }, [...(deps || []), initialModalProps])

  return {
    showModal: isLazyComponent(FC) ? showModalWithLazy : showModal,
    id: modalDetails.current.id,
    imperativeModalMap,
  }
}
