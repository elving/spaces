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

  schema
    .virtual('products')
    .get(function() { return this.__products })
    .set(function(products = []) { this.__products = products })

  return schema
}
