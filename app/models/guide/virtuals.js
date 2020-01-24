import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'guide')

  schema
    .virtual('slug')
    .get(function() {
      return kebabCase(this.get('name'))
    })

  schema
    .virtual('detailUrl')
    .get(function() {
      return `guides/${this.get('sid')}/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `g/${this.get('sid')}`
    })

  return schema
}
