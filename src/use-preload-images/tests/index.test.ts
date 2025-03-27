import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreloadImages } from '../index'

describe('usePreloadImages', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    global.Image = class {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      set src(value: string) {
        const timeout = Number(value.split('/')[1])
        if (value.includes('success')) {
          setTimeout(() => this.onload?.(), timeout)
        } else {
          setTimeout(() => this.onerror?.(), timeout)
        }
      }
    } as typeof Image
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should preload images successfully', async () => {
    const imagesToLoad = ['success-image-1/10', 'success-image-2/10']
    const { result } = renderHook(() => usePreloadImages(imagesToLoad))

    await act(async () => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toEqual([
      { loaded: true, error: null, src: 'success-image-1/10' },
      { loaded: true, error: null, src: 'success-image-2/10' },
    ])
  })

  it('should handle image loading failure', async () => {
    const imagesToLoad = ['error-image-1/10', 'error-image-2/10']
    const { result } = renderHook(() => usePreloadImages(imagesToLoad))

    await act(async () => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toEqual([
      { loaded: false, error: expect.any(Error), src: 'error-image-1/10' },
      { loaded: false, error: expect.any(Error), src: 'error-image-2/10' },
    ])
  })

  it('should abort image loading', async () => {
    const imagesToLoad = ['success-image-1/10', 'success-image-2/100']
    const { result, unmount } = renderHook(() => usePreloadImages(imagesToLoad))

    await act(async () => {
      vi.advanceTimersByTime(20)
    })

    unmount()

    expect(result.current).toEqual([
      {
        error: null,
        loaded: true,
        src: 'success-image-1/10',
      },
    ])
  })

  it('should handle image src as a Promise function', async () => {
    const mockSrcFunction1 = vi.fn(() => Promise.resolve('success-image-1/10'))
    const mockSrcFunction2 = vi.fn(() => Promise.resolve('success-image-2/10'))

    const imagesToLoad = [mockSrcFunction1, mockSrcFunction2]
    const { result } = renderHook(() => usePreloadImages(imagesToLoad))

    await act(async () => {
      vi.advanceTimersByTime(50)
      await vi.runAllTimersAsync()
    })

    expect(result.current).toEqual([
      { loaded: true, error: null, src: 'success-image-1/10' },
      { loaded: true, error: null, src: 'success-image-2/10' },
    ])

    expect(mockSrcFunction1).toHaveBeenCalledTimes(1)
    expect(mockSrcFunction2).toHaveBeenCalledTimes(1)
  })
})
