export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'category')

  schema
    .virtual('detailUrl')
    .get(function() {
      return `categories/${this.get('sid')}/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `c/${this.get('sid')}`
    })

  return schema
}
