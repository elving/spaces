export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'comment')

  return schema
}
