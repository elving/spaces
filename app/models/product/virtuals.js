import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'

import setAssetUrl from '../../utils/setAssetUrl'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'product')

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
      return `products/${this.get('sid')}/${kebabCase(this.get('name'))}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `p/${this.get('sid')}`
    })

  return schema
}
