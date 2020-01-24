export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'color')

  return schema
}
