import React from 'react'

export const isBrowser = () => {
  return typeof window !== 'undefined' && window.document && window.document.createElement
}

export const isFunction = (value: unknown): value is (...args: any) => any => typeof value === 'function'

export const isUndefined = (value: unknown): value is undefined => value === undefined

export const isLazyComponent = (component: any) => {
  // @ts-ignore
  return component?.$$typeof === React.lazy(() => null).$$typeof
}
