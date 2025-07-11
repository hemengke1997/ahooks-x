import { act, cleanup, render } from '@testing-library/react'
import { lazy } from 'react'
import { App } from 'antd'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { imperativeModalMap, type Props, useImperativeAntdModal } from '..'

const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)

const TestComponent = (props: Props) => {
  const { showModal, updateModal } = useImperativeAntdModal({
    ...props,
    FC: ({ closeModal, content = 'Hello, Modal!' }: { closeModal: () => void; content?: string }) => (
      <div>
        <p>{content}</p>
        <button onClick={closeModal}>Close</button>
      </div>
    ),
    modalProps: {
      destroyOnClose: true,
      ...props.modalProps,
    },
  })

  return (
    <div>
      <button onClick={() => showModal({})}>Open Modal</button>
      <button
        onClick={() =>
          updateModal({
            content: 'Modal Updated',
          })
        }
      >
        Update Modal
      </button>
    </div>
  )
}

describe('useImperativeAntdModal', () => {
  beforeEach(() => {})

  afterEach(() => {
    cleanup()
    imperativeModalMap.clear()
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

  it('should work with lazy component', async () => {
    const LazyComponent = lazy(() => import('./fixtures/Lazy'))

    const TestLazyComponent = () => {
      const { showModal } = useImperativeAntdModal({
        FC: LazyComponent,
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

    const { getByText, findByText } = render(
      <App>
        <TestLazyComponent />
      </App>,
    )

    act(() => {
      getByText('Open Modal').click()
    })

    expect(imperativeModalMap.size).toBe(1)

    const lazyContent = await findByText('lazy')
    expect(lazyContent).toBeTruthy()
  })

  it('should imperativeModalMap reactive', async () => {
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
      imperativeModalMap.clear()
    })

    expect(imperativeModalMap.size).toBe(0)
  })

  it('should afterClose work', () => {
    const afterClose = vi.fn()

    const { getByText } = render(
      <App>
        <TestComponent
          modalProps={{
            afterClose,
          }}
        />
      </App>,
    )

    act(() => {
      getByText('Open Modal').click()
    })

    expect(imperativeModalMap.size).toBe(1)

    act(() => {
      getByText('Close').click()
    })

    expect(afterClose).toHaveBeenCalledTimes(1)
  })

  it('should update inner component props work', async () => {
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
      getByText('Update Modal').click()
    })

    await expect(findByText('Modal Updated')).resolves.toBeTruthy()
  })
})
