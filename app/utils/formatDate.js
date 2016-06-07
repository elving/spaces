export default (str) => {
  const date = new Date(str)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const day = date.getDate() + 1
  const year = date.getFullYear()
  const month = date.getMonth()

  return `${months[month]} ${day}, ${year}`
}
