import { act, renderHook, screen, waitFor } from '@testing-library/react'
import { Modal, type ModalProps } from 'antd'
import { describe, expect, it } from 'vitest'
import { useImperative } from '..'

function MyModal(
  props: ModalProps & {
    text: string
  },
) {
  const { text, ...rest } = props
  return (
    <Modal {...rest} destroyOnClose={true}>
      {text}
    </Modal>
  )
}

const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)

describe('useImperative', () => {
  it('should work', async () => {
    const { result } = renderHook(() => useImperative(MyModal))
    act(() => {
      result.current.open({ text: 'Hello, world' })
    })

    await expect(screen.findByText('Hello, world')).resolves.toBeTruthy()

    act(() => {
      result.current.close()
    })

    await waitFor(() => {
      expect(screen.queryByText('Hello, world')).toBeNull()
    })
  })
})
