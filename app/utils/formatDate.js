export default (str) => {
  let day, year, month
  const date = new Date(str)

  day = date.getDate() + 1
  if (day <= 9) day = `0${day}`

  year = date.getFullYear()

  month = date.getMonth() + 1
  if (month <= 9) month = `0${month}`

  return `${month}-${day}-${year}`
}
