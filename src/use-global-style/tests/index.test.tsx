import { render } from '@testing-library/react'
import { TinyColor } from '@ctrl/tinycolor'
import { describe, expect, it } from 'vitest'
import { useGlobalStyle } from '../use-global-style'

describe('useGlobalStyle', () => {
  it('check styles', () => {
    const Component = () => {
      useGlobalStyle('div', {
        color: 'red',
      })

      useGlobalStyle('body', {
        margin: '20px',
      })

      return <div>some text</div>
    }

    const renderResult = render(<Component />)

    const element = renderResult.getByText('some text')
    const body = element.closest('body')!

    expect(window.getComputedStyle(element).color).toBe(new TinyColor('red').toRgbString())
    expect(window.getComputedStyle(body).margin).toBe('20px')

    renderResult.unmount()

    expect(window.getComputedStyle(element).color).not.toBe(new TinyColor('red').toRgbString())
    expect(window.getComputedStyle(body).margin).not.toBe('20px')
  })

  it('check styles with enabled', () => {
    const Component = () => {
      useGlobalStyle(
        'div',
        {
          color: 'red',
        },
        {
          enabled: false,
        },
      )

      return <div>some text</div>
    }

    const renderResult = render(<Component />)

    const element = renderResult.getByText('some text')

    expect(window.getComputedStyle(element).color).not.toBe(new TinyColor('red').toRgbString())

    renderResult.unmount()

    expect(window.getComputedStyle(element).color).not.toBe(new TinyColor('red').toRgbString())
  })

  it('check styles with importantAll', () => {
    const Component = () => {
      useGlobalStyle(
        'div',
        {
          color: 'red',
        },
        {
          importantAll: true,
          enabled: true,
        },
      )

      return (
        <div
          style={{
            color: 'green',
          }}
        >
          some text
        </div>
      )
    }

    render(<Component />)
    const styleSheet = document.styleSheets[0]
    const rules = Array.from(styleSheet.cssRules).map((rule) => rule.cssText)

    expect(rules.some((rule) => rule.includes('color: red !important'))).toBe(true)
  })
})
