import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSteps } from '..'

describe('use step', () => {
  it('should be work', () => {
    const { result } = renderHook(() => useSteps([1, 2, 3], {}))

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(2)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(3)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(1)
  })
})
