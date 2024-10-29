const replaceCallback = (char: string) => `-${char.toLowerCase()}`

export const camelToKebabCase = (value: string) => {
  return value.replace(/[A-Z]/g, replaceCallback)
}
