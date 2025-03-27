import { act, cleanup, render } from '@testing-library/react'
import { App } from 'antd'
import { afterEach, describe, expect, it } from 'vitest'
import { imperativeModalMap, useImperativeAntdModal } from '..'

const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)

const TestComponent = () => {
  const { showModal } = useImperativeAntdModal({
    FC: ({ closeModal }: { closeModal: () => void }) => (
      <div>
        <p>Hello, Modal!</p>
        <button onClick={closeModal}>Close</button>
      </div>
    ),
    modalProps: {
      destroyOnClose: true,
    },
  })

  return (
    <div>
      <button onClick={() => showModal({})}>Open Modal</button>
    </div>
  )
}

describe('useImperativeAntdModal', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render modal correctly', async () => {
    const { getByText, findByText } = render(
      <App>
        <TestComponent />
      </App>,
    )

    act(() => {
      getByText('Open Modal').click()
    })

    await expect(findByText('Hello, Modal!')).resolves.toBeTruthy()
    expect(imperativeModalMap.size).toBe(1)

    act(() => {
      getByText('Close').click()
    })

    await expect(findByText('Hello, Modal!')).rejects.toBeTruthy()
    expect(imperativeModalMap.size).toBe(0)
  })

  it('should not open mutilple modals', async () => {
    const { getByText } = render(
      <App>
        <TestComponent />
      </App>,
    )

    act(() => {
      getByText('Open Modal').click()
    })

    act(() => {
      getByText('Open Modal').click()
    })

    expect(imperativeModalMap.size).toBe(1)
  })

  it('should open mutilple modals', async () => {
    const { getByText } = render(
      <App>
        <TestComponent />
      </App>,
    )

    act(() => {
      getByText('Open Modal').click()
    })

    act(() => {
      getByText('Open Modal').click()
    })

    expect(imperativeModalMap.size).toBe(2)
  })
})
