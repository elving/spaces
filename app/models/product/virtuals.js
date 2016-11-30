import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'

import setAssetUrl from '../../utils/setAssetUrl'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'product')

  schema
    .virtual('slug')
    .get(function() {
      return kebabCase(this.get('name'))
    })

  schema
    .virtual('imageUrl')
    .get(function() {
      return !isEmpty(this.get('image'))
        ? setAssetUrl(this.get('image'))
        : ''
    })

  schema
    .virtual('detailUrl')
    .get(function() {
      return `products/${this.get('sid')}/${this.get('slug')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `p/${this.get('sid')}`
    })

  schema
    .virtual('lastLikes')
    .get(function() { return this.__lastLikes })
    .set(function(lastLikes = []) { this.__lastLikes = lastLikes })

  schema
    .virtual('lastComments')
    .get(function() { return this.__lastComments })
    .set(function(lastComments = []) { this.__lastComments = lastComments })

  schema
    .virtual('wasNew')
    .get(function() { return this.__wasNew })
    .set(function(wasNew = false) { this.__wasNew = wasNew })

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
    .virtual('shouldUpdateRooms')
    .get(function() { return this.__shouldUpdateRooms })
    .set(function(shouldUpdateRooms = false) {
      this.__shouldUpdateRooms = shouldUpdateRooms
    })

  schema
    .virtual('shouldNotifyApproval')
    .get(function() { return this.__shouldNotifyApproval })
    .set(function(shouldNotifyApproval = false) {
      this.__shouldNotifyApproval = shouldNotifyApproval
    })

  schema
    .virtual('productRooms')
    .get(function() { return this.__productRooms })
    .set(function(productRooms = []) {
      this.__productRooms = productRooms
    })

  return schema
}
