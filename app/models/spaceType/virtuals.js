import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'spaceType')

  schema
    .virtual('slug')
    .get(function() {
      return kebabCase(this.get('name'))
    })

  schema
    .virtual('detailUrl')
    .get(function() {
      return `rooms/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `r/${this.get('slug')}`
    })

  schema
    .virtual('spaces')
    .get(function() { return this.__spaces })
    .set(function(spaces = []) { this.__spaces = spaces })

  schema
    .virtual('products')
    .get(function() { return this.__products })
    .set(function(products = []) { this.__products = products })

  return schema
}
