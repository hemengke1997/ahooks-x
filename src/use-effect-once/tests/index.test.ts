import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useEffectOnce } from '..'

describe('useEffectOnce', () => {
  it('should only run once', () => {
    const cb = vi.fn()
    renderHook(() => {
      useEffectOnce(cb)
    })
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
