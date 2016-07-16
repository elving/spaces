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

  return schema
}
