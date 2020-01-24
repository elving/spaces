import isEmpty from 'lodash/isEmpty'
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
    .virtual('shareImage')
    .get(function() {
      const coverImage = this.get('coverImage')

      if (!isEmpty(coverImage)) {
        return coverImage
      }

      return this.get('image')
    })

  schema
    .virtual('forcedUpdate')
    .get(function() { return this.__forcedUpdate })
    .set(function(force = false) { this.__forcedUpdate = force })

  schema
    .virtual('wasNew')
    .get(function() { return this.__wasNew })
    .set(function(wasNew = false) { this.__wasNew = wasNew })

  schema
    .virtual('shouldUpdateImage')
    .get(function() { return this.__shouldUpdateImage })
    .set(function(shouldUpdateImage = false) {
      this.__shouldUpdateImage = shouldUpdateImage
    })

  schema
    .virtual('productImages')
    .get(function() { return this.__productImages })
    .set(function(productImages = false) {
      this.__productImages = productImages
    })

  schema
    .virtual('shouldUpdateCategories')
    .get(function() { return this.__shouldUpdateCategories })
    .set(function(shouldUpdateCategories = false) {
      this.__shouldUpdateCategories = shouldUpdateCategories
    })

  schema
    .virtual('productCategories')
    .get(function() { return this.__productCategories })
    .set(function(productCategories = []) {
      this.__productCategories = productCategories
    })

  schema
    .virtual('skipPostSaveHook')
    .get(function() { return this.__skipPostSaveHook })
    .set(function(skipPostSaveHook = false) {
      this.__skipPostSaveHook = skipPostSaveHook
    })

  return schema
}
