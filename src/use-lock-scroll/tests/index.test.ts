import { act, fireEvent, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useLockScroll } from '../index'

describe('useLockScroll', () => {
  let originalBodyOverflow: string

  beforeEach(() => {
    originalBodyOverflow = document.body.style.overflow
  })

  afterEach(() => {
    document.body.style.overflow = originalBodyOverflow
  })

  it('should lock scroll when shouldLock is true', () => {
    const { rerender, unmount } = renderHook(({ shouldLock }) => useLockScroll(shouldLock), {
      initialProps: { shouldLock: true },
    })

    expect(document.body.style.overflow).toBe('hidden')

    rerender({ shouldLock: false })

    expect(document.body.style.overflow).toBe(originalBodyOverflow)

    unmount()

    expect(document.body.style.overflow).toBe(originalBodyOverflow)
  })

  it('should not lock scroll when shouldLock is false', () => {
    renderHook(() => useLockScroll(false))

    expect(document.body.style.overflow).toBe(originalBodyOverflow)
  })

  it('should support custom root element', () => {
    const rootElement = document.createElement('div')
    document.body.appendChild(rootElement)

    const { unmount } = renderHook(() => useLockScroll(true, rootElement))

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe(originalBodyOverflow)

    document.body.removeChild(rootElement)
  })

  it('should touch work with lock', () => {
    const { unmount } = renderHook(() => useLockScroll(true))

    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [
        {
          clientX: 0,
          clientY: 0,
        } as Touch,
      ],
    })

    const moveEvent = new TouchEvent('touchmove', {
      touches: [
        {
          clientX: 0,
          clientY: 100,
        } as Touch,
      ],
    })

    act(() => {
      fireEvent(document, touchStartEvent)
      fireEvent(document, moveEvent)
    })

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe(originalBodyOverflow)
  })
})
