import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'space')

  schema
    .virtual('slug')
    .get(function() {
      return kebabCase(this.get('name'))
    })

  schema
    .virtual('detailUrl')
    .get(function() {
      return `spaces/${this.get('sid')}/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `s/${this.get('sid')}`
    })

  schema
    .virtual('forcedUpdate')
    .get(function() { return this.__forcedUpdate })
    .set(function(force = false) { this.__forcedUpdate = force })

  return schema
}
