export default el => {
  const rect = el.getBoundingClientRect()

  return {
    top: rect.top,
    left: rect.left
  }
}
