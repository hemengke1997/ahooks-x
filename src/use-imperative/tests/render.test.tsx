import { act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, unmount } from '../render'

describe('react render', () => {
  afterEach(() => {
    Array.from(document.body.childNodes).forEach((node) => {
      document.body.removeChild(node)
    })
  })

  it('render & unmount', async () => {
    const errorSpy = vi.spyOn(console, 'error')

    const div = document.createElement('div')
    document.body.appendChild(div)

    // Mount
    act(() => {
      render(<div className='bamboo' />, div)
    })
    expect(div.querySelector('.bamboo')).toBeTruthy()

    // Unmount
    await act(async () => {
      await unmount(div)
    })
    expect(div.querySelector('.bamboo')).toBeFalsy()

    expect(errorSpy).not.toHaveBeenCalled()
  })
})
