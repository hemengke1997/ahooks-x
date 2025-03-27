import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useControlledState } from '..'

describe('useControlledState', () => {
  it('defaultValue should work', () => {
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
      }),
    )
    expect(result.current[0]).toBe(1)
  })

  it('value should work', () => {
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
        value: 2,
      }),
    )
    expect(result.current[0]).toBe(2)
  })

  it('state should be undefined', () => {
    const { result } = renderHook(() => useControlledState({}))
    expect(result.current[0]).toBeUndefined()
  })

  it('onChange should work', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
        onChange,
      }),
    )
    act(() => {
      result.current[1](3)
    })
    expect(onChange).toHaveBeenCalledWith(3, 1)
    expect(result.current[0]).toBe(3)
  })

  it('beforeValue should work', () => {
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
        beforeValue: (value) => value + 1,
      }),
    )
    act(() => {
      result.current[1](3)
    })
    expect(result.current[0]).toBe(4)
  })

  it('postValue should work', () => {
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
        postValue: (value) => value + 1,
      }),
    )
    act(() => {
      result.current[1](3)
    })
    expect(result.current[0]).toBe(4)
  })

  it('onInit should work', () => {
    const onInit = vi.fn()
    renderHook(() =>
      useControlledState({
        defaultValue: 1,
        onInit,
      }),
    )
    expect(onInit).toHaveBeenCalledWith(1)
  })

  it('onInit should execute once', () => {
    const onInit = vi.fn()
    const { rerender } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
        onInit,
      }),
    )
    rerender()
    expect(onInit).toHaveBeenCalledTimes(1)
  })

  it('beforeValue should execute before postValue', () => {
    const before = vi.fn((value) => value + 1)
    const post = vi.fn((value) => value + 1)
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
        beforeValue: before,
        postValue: post,
        onChange,
      }),
    )
    act(() => {
      result.current[1](3)
    })
    expect(before).toHaveBeenCalledWith(3, 1)
    expect(onChange).toHaveBeenCalledWith(4, 1)
    expect(post).toHaveBeenCalledWith(4, 1)
    expect(result.current[0]).toBe(5)
  })

  it('test on value update', () => {
    const props = {
      value: 1,
    }
    const { result, rerender } = renderHook(() => useControlledState(props))
    expect(result.current[0]).toBe(1)
    props.value = 2
    rerender()
    expect(result.current[0]).toBe(2)
    props.value = 3
    rerender()
    expect(result.current[0]).toBe(3)
  })

  it('test set state', () => {
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 1,
      }),
    )
    const [_, setState] = result.current
    act(() => {
      setState(0)
    })
    expect(result.current[0]).toBe(0)

    act(() => {
      setState((prev) => prev + 1)
    })
    expect(result.current[0]).toBe(1)
  })

  it('test controlled state', () => {
    const { result } = renderHook(() =>
      useControlledState({
        value: 1,
      }),
    )
    const [_, setState] = result.current
    act(() => {
      setState(0)
    })
    expect(result.current[0]).toBe(1)
  })
})
