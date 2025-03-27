import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Trigger, useTrackState } from '..'

describe('use track state', () => {
  it('should work', () => {
    const { result, rerender } = renderHook((initialProps) => useTrackState(initialProps))

    expect(result.current[0]).toBeUndefined()

    act(() => {
      rerender('test')
    })

    expect(result.current[0]).toBe('test')
  })

  it('defaultValue should work', () => {
    const { result } = renderHook(() => useTrackState('', { defaultValue: 'default' }))

    expect(result.current[0]).toBe('default')
  })

  it('defaultValue should not override trackState', () => {
    const { result } = renderHook(() => useTrackState('track', { defaultValue: 'default' }))

    expect(result.current[0]).toBe('track')
  })

  it('onChangeBySet should work', () => {
    const onChangeBySet = vi.fn()
    const { result } = renderHook(() => useTrackState<string>('', { onChangeBySet }))

    act(() => {
      result.current[1]('test')
    })
    expect(result.current[2]).toBe(Trigger.set)
    expect(onChangeBySet).toHaveBeenCalledTimes(1)
  })

  it('onChangeByTrack should work', () => {
    const onChangeByTrack = vi.fn()
    const { result, rerender } = renderHook((state) => useTrackState(state, { onChangeByTrack }))

    act(() => {
      rerender('test')
    })
    expect(result.current[2]).toBe(Trigger.track)
    expect(onChangeByTrack).toHaveBeenCalledTimes(1)
  })
})
