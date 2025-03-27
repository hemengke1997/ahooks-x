import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSetStatePlugin } from '../index'

describe('useSetStatePlugin', () => {
  it('should initialize with the correct state', () => {
    const initialState = { count: 0, name: 'test' }
    const { result } = renderHook(() => useSetStatePlugin(initialState))

    expect(result.current[0]).toEqual(initialState)
  })

  it('should update state with partial updates', () => {
    const initialState = { count: 0, name: 'test' }
    const { result } = renderHook(() => useSetStatePlugin(initialState))

    act(() => {
      result.current[1]({ count: 1 })
    })

    expect(result.current[0]).toEqual({ count: 1, name: 'test' })
  })

  it('should update state with a function', () => {
    const initialState = { count: 0, name: 'test' }
    const { result } = renderHook(() => useSetStatePlugin(initialState))

    act(() => {
      result.current[1]((prevState) => ({ count: prevState.count + 1 }))
    })

    expect(result.current[0]).toEqual({ count: 1, name: 'test' })
  })

  it('should handle null updates without changing state', () => {
    const initialState = { count: 0, name: 'test' }
    const { result } = renderHook(() => useSetStatePlugin(initialState))

    act(() => {
      result.current[1](null)
    })

    expect(result.current[0]).toEqual(initialState)
  })

  it('should work with storage plugin', () => {
    const mockStorage = {
      getItem: vi.fn(() => JSON.stringify({ count: 5 })),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } as unknown as Storage

    const { result } = renderHook(() =>
      useSetStatePlugin(
        { count: 0 },
        {
          storage: {
            key: 'test-key',
            api: mockStorage,
          },
        },
      ),
    )

    expect(result.current[0]).toEqual({ count: 5 })

    act(() => {
      result.current[1]({ count: 10 })
    })

    expect(result.current[0]).toEqual({ count: 10 })
    expect(mockStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify({ count: 10 }))
  })

  it('should work with custom plugins', () => {
    const customPlugin = vi.fn(() => ({
      onInit: (state: any) => ({ ...state, initialized: true }),
      onSetState: (state: any) => ({ ...state, updated: true }),
    }))

    const { result } = renderHook(() => useSetStatePlugin({ count: 0 }, {}, [customPlugin]))

    expect(result.current[0]).toEqual({ count: 0, initialized: true })

    act(() => {
      result.current[1]({ count: 1 })
    })

    expect(result.current[0]).toEqual({ count: 1, initialized: true, updated: true })
  })
})
