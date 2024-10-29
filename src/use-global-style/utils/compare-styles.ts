import type { CSSProperties } from 'react'

export const compareStyles = (currentStyles: CSSProperties, nextStyles: CSSProperties) => {
  if (currentStyles === nextStyles) {
    return true
  }

  const currentKeys = Object.keys(currentStyles) as ReadonlyArray<keyof CSSProperties>
  const nextKeys = Object.keys(nextStyles) as ReadonlyArray<keyof CSSProperties>

  if (currentKeys.length !== nextKeys.length) {
    return false
  }

  return currentKeys.every((key) => currentStyles[key] === nextStyles[key])
}
