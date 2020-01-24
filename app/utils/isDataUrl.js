export default value => (
  (/^data:image\/\w+;base64,/).test(value)
)
