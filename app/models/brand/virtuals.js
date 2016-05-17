export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'spaceType')

  schema
    .virtual('detailUrl')
    .get(function() {
      return `brands/${this.get('sid')}/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `b/${this.get('sid')}`
    })

  return schema
}
