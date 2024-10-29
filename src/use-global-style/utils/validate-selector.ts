export const validateSelector = (selector: string) => {
  try {
    document.querySelector(selector)
    return true
  } catch {
    return false
  }
}
