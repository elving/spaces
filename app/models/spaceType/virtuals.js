export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'spaceType')

  return schema
}
