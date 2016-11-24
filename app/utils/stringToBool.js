export default (value) => {
  if (value === true || value === 'true' || value === 'True') {
    return true
  } else if (value === false || value === 'false' || value === 'False') {
    return false
  }

  return false
}
