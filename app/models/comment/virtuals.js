export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'comment')

  schema
    .virtual('wasNew')
    .get(function() { return this.__wasNew })
    .set(function(wasNew = false) { this.__wasNew = wasNew })

  return schema
}
