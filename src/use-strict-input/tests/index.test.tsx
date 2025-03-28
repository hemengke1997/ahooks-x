import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useStrictInput } from '..'

const TestComponent = (props: { defaultValue?: string; strict?: RegExp; handleChange?: (value: string) => void }) => {
  const { defaultValue = '', strict, handleChange } = props
  const [value, setValue] = useState(defaultValue)
  const { onCompositionStart, onCompositionEnd, onChange } = useStrictInput({
    value,
    onChange: (value) => {
      setValue(value)
      handleChange?.(value)
    },
    strict,
  })

  return (
    <input
      data-testid='input'
      value={value}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    />
  )
}

describe('useStrictInput', () => {
  afterEach(() => {
    cleanup()
  })
  it('should work', async () => {
    const { getByTestId } = render(<TestComponent />)
    const input = getByTestId('input') as HTMLInputElement

    await userEvent.type(input, '123')

    expect(input.value).toBe('123')
  })

  it('should not work with string', async () => {
    const { getByTestId } = render(<TestComponent />)
    const input = getByTestId('input') as HTMLInputElement

    await userEvent.type(input, 'Hello')

    expect(input.value).toBe('')
  })

  it('should work with string', async () => {
    const regexp = /[a-zA-Z\D]/g
    const { getByTestId } = render(<TestComponent strict={regexp} />)
    const input = getByTestId('input') as HTMLInputElement

    await userEvent.type(input, '123')

    expect(input.value).toBe('123')
  })

  it('should handle composition input', async () => {
    const handleChange = vi.fn()
    const { getByTestId } = render(<TestComponent handleChange={handleChange} strict={/[a-zA-Z\D]/g} />)
    const input = getByTestId('input') as HTMLInputElement

    fireEvent.compositionStart(input)

    expect(handleChange).not.toHaveBeenCalled()

    await userEvent.type(input, '拼音')

    fireEvent.compositionEnd(input)

    expect(handleChange).toHaveBeenCalledWith('拼音')
  })
})
