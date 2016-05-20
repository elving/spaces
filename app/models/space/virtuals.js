import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'space')

  schema
    .virtual('detailUrl')
    .get(function() {
      return `spaces/${this.get('sid')}/${kebabCase(this.get('name'))}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `s/${this.get('sid')}`
    })

  return schema
}
