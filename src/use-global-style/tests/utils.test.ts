import { describe, expect, it } from 'vitest'
import { camelToKebabCase } from '../utils/camel-to-kebab-case'
import { compareStyles } from '../utils/compare-styles'
import { stylesToCSSText } from '../utils/styles-to-css-text'
import { validateSelector } from '../utils/validate-selector'

describe('camel to kebab case', () => {
  it('should work', () => {
    expect(camelToKebabCase('backgroundColor')).toBe('background-color')
    expect(camelToKebabCase('borderTopRightRadius')).toBe('border-top-right-radius')
    expect(camelToKebabCase('color')).toBe('color')
    expect(camelToKebabCase('fontFamily')).toBe('font-family')
    expect(camelToKebabCase('zIndex')).toBe('z-index')
  })
  it('should add prefix', () => {
    expect(camelToKebabCase('WebkitLineClamp')).toBe('-webkit-line-clamp')
    expect(camelToKebabCase('WebkitTransform')).toBe('-webkit-transform')
    expect(camelToKebabCase('WebkitUserSelect')).toBe('-webkit-user-select')
  })
})

describe('compare styles', () => {
  it('check for compliance', () => {
    expect(compareStyles({}, {})).toBeTruthy()

    expect(
      compareStyles(
        {
          color: '#FF0000',
        },
        {
          color: '#FF0000',
        },
      ),
    ).toBeTruthy()

    expect(
      compareStyles(
        {
          backgroundColor: 'transparent',
          fontSize: '16px',
          padding: '24px 32px',
          position: 'absolute',
          zIndex: '1',
        },
        {
          backgroundColor: 'transparent',
          fontSize: '16px',
          padding: '24px 32px',
          position: 'absolute',
          zIndex: '1',
        },
      ),
    )

    expect(
      compareStyles(
        {
          WebkitLineClamp: '2',
          WebkitUserSelect: 'none',
        },
        {
          WebkitLineClamp: '2',
          WebkitUserSelect: 'none',
        },
      ),
    )
  })

  it('Check for compliance with reference object', () => {
    const styles = {
      backgroundAttachment: 'fixed',
      lineHeight: '1.5',
      whiteSpacing: 'nowrap',
    }

    expect(compareStyles(styles, styles)).toBeTruthy()
  })

  it('Check for mismatch', () => {
    expect(compareStyles({}, { color: 'blue' })).toBeFalsy()
    expect(compareStyles({ color: 'blue' }, {})).toBeFalsy()
    expect(compareStyles({ backgroundColor: 'green', borderRadius: '12px' }, { backgroundColor: 'green' })).toBeFalsy()
    expect(compareStyles({ borderRadius: '12px' }, { backgroundColor: 'green', borderRadius: '12px' })).toBeFalsy()
    expect(compareStyles({ height: '32px', width: '24px' }, { height: '24px', width: '24px' })).toBeFalsy()
    expect(
      compareStyles({ boxSizing: 'border-box', height: '32px', width: '24px' }, { height: '32px', width: '24px' }),
    ).toBeFalsy()
    expect(compareStyles({ margin: 'auto' }, { margin: 'auto !important' })).toBeFalsy()
    expect(compareStyles({ outlineColor: 'red' }, { outlineColor: 'var(--red)' })).toBeFalsy()
    expect(compareStyles({ WebkitUserSelect: 'none' }, { userSelect: 'none' })).toBeFalsy()
  })
})

describe('styles to css text', () => {
  it('check style props', () => {
    expect(stylesToCSSText('div', { color: 'red' }, false)).toBe('div{color:red}')
    expect(stylesToCSSText('div', { color: 'red!important' }, false)).toBe('div{color:red!important}')
    expect(stylesToCSSText('div', { color: 'red', marginTop: '8px' }, false)).toBe('div{color:red;margin-top:8px}')
    expect(stylesToCSSText('div', { position: 'fixed', zIndex: '100' }, false)).toBe('div{position:fixed;z-index:100}')
    expect(stylesToCSSText('div, span', { boxSizing: 'border-box' }, false)).toBe('div, span{box-sizing:border-box}')
    expect(stylesToCSSText('.test', { height: '32px', width: '24px' }, false)).toBe('.test{height:32px;width:24px}')
    expect(stylesToCSSText('.test::after, .test::before', { content: '"!"', display: 'block' }, false)).toBe(
      '.test::after, .test::before{content:"!";display:block}',
    )
  })

  it('Check style props with important option', () => {
    expect(stylesToCSSText('div', { color: 'red' }, true)).toBe('div{color:red!important}')
    expect(stylesToCSSText('div', { color: 'red!important' }, true)).toBe('div{color:red!important}')
    expect(stylesToCSSText('div', { color: 'red', marginTop: '8px' }, true)).toBe(
      'div{color:red!important;margin-top:8px!important}',
    )
    expect(stylesToCSSText('div', { position: 'fixed', zIndex: '100' }, true)).toBe(
      'div{position:fixed!important;z-index:100!important}',
    )
    expect(stylesToCSSText('div, span', { boxSizing: 'border-box' }, true)).toBe(
      'div, span{box-sizing:border-box!important}',
    )
    expect(stylesToCSSText('.test', { height: '32px', width: '24px' }, true)).toBe(
      '.test{height:32px!important;width:24px!important}',
    )
  })

  it('Check style props with media query', () => {
    expect(stylesToCSSText('div', { color: 'red' }, false, 'all and (max-width: 640px)')).toBe(
      '@media all and (max-width: 640px){div{color:red}}',
    )
    expect(stylesToCSSText('div', { color: 'red', marginTop: '8px' }, false, 'all and (max-width: 640px)')).toBe(
      '@media all and (max-width: 640px){div{color:red;margin-top:8px}}',
    )
    expect(stylesToCSSText('.test span', { height: '32px', width: '24px' }, false, 'all and (max-width: 640px)')).toBe(
      '@media all and (max-width: 640px){.test span{height:32px;width:24px}}',
    )
  })
})

describe('validate selectors', () => {
  it('Check simple selectors', () => {
    expect(validateSelector('div')).toBeTruthy()
    expect(validateSelector('span')).toBeTruthy()
    expect(validateSelector('.test')).toBeTruthy()
    expect(validateSelector('#test')).toBeTruthy()
    expect(validateSelector('[title]')).toBeTruthy()
    expect(validateSelector('[title="test"]')).toBeTruthy()
    expect(validateSelector('[title^="test"]')).toBeTruthy()
    expect(validateSelector('[title~="test"]')).toBeTruthy()
    expect(validateSelector('[title$="test"]')).toBeTruthy()
    expect(validateSelector('[title*="test"]')).toBeTruthy()
    expect(validateSelector('[title|="test"]')).toBeTruthy()
    expect(validateSelector('div[class="test"]')).toBeTruthy()
    expect(validateSelector('*')).toBeTruthy()
    expect(validateSelector(':root')).toBeTruthy()
  })

  it('Check multiple selectors', () => {
    expect(validateSelector('div, span')).toBeTruthy()
    expect(validateSelector('.header, .footer')).toBeTruthy()
    expect(validateSelector('#test, #js-test')).toBeTruthy()
    expect(validateSelector('[title="a"], [title^="b"], [title~="c"], [title$="d"]')).toBeTruthy()
    expect(validateSelector('div[class="test"], span[id="test"]')).toBeTruthy()
    expect(validateSelector(':root, body')).toBeTruthy()
  })

  it('Check nested selectors', () => {
    expect(validateSelector('div > span')).toBeTruthy()
    expect(validateSelector('h1 small, h2 small')).toBeTruthy()
    expect(validateSelector('.test + div')).toBeTruthy()
    expect(validateSelector('.test ~ span')).toBeTruthy()
    expect(validateSelector('div[class="test"] ~ *')).toBeTruthy()
  })

  it('Check pseudo classes and pseudo elements', () => {
    expect(validateSelector('div::after')).toBeTruthy()
    expect(validateSelector('div::before')).toBeTruthy()
    expect(validateSelector('.test:hover')).toBeTruthy()
    expect(validateSelector('a:active, button:focus')).toBeTruthy()
    expect(validateSelector('div[class="test"] ~ *')).toBeTruthy()
    expect(validateSelector('div:nth-child(2n)')).toBeTruthy()
    expect(validateSelector('div:nth-child(2n)')).toBeTruthy()
  })

  it('Check invalid selectors', () => {
    expect(validateSelector('..test')).toBeFalsy()
    expect(validateSelector('##test')).toBeFalsy()
    expect(validateSelector('@test')).toBeFalsy()
    expect(validateSelector('div < span')).toBeFalsy()
    expect(validateSelector('div ^ span')).toBeFalsy()
    expect(validateSelector('!test')).toBeFalsy()
    expect(validateSelector('div[class!="test"]')).toBeFalsy()
    expect(validateSelector('div::after(10)')).toBeFalsy()
  })
})
