export default (number, singular, plural) => (
  number === 1 ? singular : (plural ? plural : `${singular}s`)
)
