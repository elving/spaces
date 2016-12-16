export default (str) => {
  const nth = day => {
    if (day > 3 && day < 21) {
      return 'th'
    }

    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const date = new Date(str)
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ]

  const day = date.getDate() + 1
  const year = date.getFullYear()
  const month = date.getMonth()

  return `${months[month]} ${day}${nth(day)}, ${year}`
}
