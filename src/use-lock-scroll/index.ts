import { useEffect, useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import { isBrowser } from '../utils/is'
import { useTouch } from './use-touch'

let totalLockCount = 0

type ScrollElement = Element | HTMLElement | Window | undefined | null

const overflowScrollReg = /scroll|auto/i
const defaultRoot = isBrowser() ? window : undefined

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1
  return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE
}

function getScrollParent(el: Element, root: ScrollElement = defaultRoot): ScrollElement {
  if (root === undefined) {
    root = window
  }
  let node = el
  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node
      }

      const htmlOverflowY = window.getComputedStyle(node.parentNode as Element).overflowY
      if (overflowScrollReg.test(htmlOverflowY)) {
        return node
      }
    }
    node = node.parentNode as Element
  }
  return root
}

// Modified from vant
export function useLockScroll(shouldLock: boolean = false, root: ScrollElement = defaultRoot) {
  const touch = useTouch()
  const DIRECTION_UP = '01'
  const DIRECTION_DOWN = '10'

  const bodyInitialOverflow = useRef(isBrowser() ? document.body.style.overflow : '')

  useEffect(() => {
    if (shouldLock && root) {
      lock()
      return () => {
        unlock()
      }
    }
  }, [shouldLock])

  const onTouchMove = useMemoizedFn((event: TouchEvent) => {
    touch.move(event)

    const direction = touch.deltaY.current > 0 ? DIRECTION_DOWN : DIRECTION_UP
    const el = getScrollParent(event.target as Element, root) as HTMLElement
    const { scrollHeight, offsetHeight, scrollTop } = el
    let status = '11'

    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01'
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10'
    }

    if (status !== '11' && touch.isVertical() && !(Number.parseInt(status, 2) & Number.parseInt(direction, 2))) {
      event.preventDefault()
    }
  })

  const lock = useMemoizedFn(() => {
    document.addEventListener('touchstart', touch.start)
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    if (!totalLockCount) {
      document.body.style.overflow = 'hidden'
    }

    totalLockCount++
  })

  const unlock = useMemoizedFn(() => {
    if (totalLockCount) {
      document.removeEventListener('touchstart', touch.start)
      document.removeEventListener('touchmove', onTouchMove)

      totalLockCount--

      if (!totalLockCount) {
        document.body.style.overflow = bodyInitialOverflow.current
      }
    }
  })
}
