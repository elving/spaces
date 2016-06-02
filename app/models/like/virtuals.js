export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'like')

  return schema
}
