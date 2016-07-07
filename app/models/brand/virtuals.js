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
      return `brands/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `b/${this.get('slug')}`
    })

  return schema
}
