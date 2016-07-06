import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'category')

  schema
    .virtual('slug')
    .get(function() {
      return kebabCase(this.get('name'))
    })

  schema
    .virtual('detailUrl')
    .get(function() {
      return `categories/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `c/${this.get('slug')}`
    })

  schema
    .virtual('products')
    .get(function() { return this.__products })
    .set(function(products = []) { this.__products = products })

  return schema
}
