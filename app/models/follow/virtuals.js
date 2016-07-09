export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'follow')

  return schema
}
