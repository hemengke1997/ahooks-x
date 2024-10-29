import { type CSSProperties, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import type { UseGlobalStyleOptions } from './types'
import { isBrowser } from '../utils/is'
import { defaultOptions } from './constants'
import { compareStyles } from './utils/compare-styles'
import { stylesToCSSText } from './utils/styles-to-css-text'

let styleNode: HTMLStyleElement | null = null

const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect

export const useGlobalStyle = (
  selector: string | string[],
  styles: CSSProperties,
  options: UseGlobalStyleOptions = defaultOptions,
) => {
  const { enabled = defaultOptions.enabled, importantAll = defaultOptions.importantAll, media } = options

  const selectorValue = Array.isArray(selector) ? selector.join(', ') : selector

  const mountedRef = useRef(false)
  const stylesRef = useRef(styles)

  const stylesValue = !mountedRef.current || !compareStyles(styles, stylesRef.current) ? styles : stylesRef.current

  useImperativeHandle(stylesRef, () => stylesValue, [stylesValue])

  useIsomorphicLayoutEffect(() => {
    if (styleNode === null) {
      styleNode = document.createElement('style')
      document.head.appendChild(styleNode)
    }

    if (!mountedRef.current) {
      mountedRef.current = true
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (enabled) {
      const sheet = styleNode!.sheet!

      const rule = stylesToCSSText(selectorValue, stylesValue, importantAll, media)
      const index = sheet.insertRule(rule, sheet.cssRules.length)

      const insertedRuleObject = sheet.cssRules[index]

      return () => {
        const currentIndex = Array.prototype.indexOf.call(sheet.cssRules, insertedRuleObject)

        sheet.deleteRule(currentIndex)
      }
    }

    return
  }, [enabled, importantAll, selectorValue, stylesValue])
}

export type { UseGlobalStyleOptions }