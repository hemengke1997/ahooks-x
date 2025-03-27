import { describe, expect, it } from 'vitest'
import { isBrowser, isFunction, isUndefined } from '..'

describe('utils', () => {
  it('is browser', () => {
    expect(isBrowser()).toBeTruthy()
  })

  it('is Function', () => {
    expect(isFunction(() => {})).toBeTruthy()
    expect(isFunction('')).toBeFalsy()
    expect(isFunction(1)).toBeFalsy()
    expect(isFunction({})).toBeFalsy()
  })

  it('is undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
  })
})
