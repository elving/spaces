import get from 'lodash/get'
import head from 'lodash/head'
import size from 'lodash/size'
import kebabCase from 'lodash/kebabCase'

import setAssetUrl from '../../utils/setAssetUrl'

export default (schema) => {
  schema
    .virtual('type')
    .get(() => 'space')

  schema
    .virtual('imageUrl')
    .get(function() {
      return size(this.get('images'))
        ? setAssetUrl(get(head(this.get('images')), 'url'))
        : ''
    })

  schema
    .virtual('imageWidth')
    .get(function() {
      return size(this.get('images'))
        ? get(head(this.get('images')), 'width')
        : ''
    })

  schema
    .virtual('imageHeight')
    .get(function() {
      return size(this.get('images'))
        ? get(head(this.get('images')), 'height')
        : ''
    })

  schema
    .virtual('imageOrientation')
    .get(function() {
      return size(this.get('images'))
        ? get(head(this.get('images')), 'orientation')
        : ''
    })

  schema
    .virtual('modelUrl')
    .get(function() {
      const id = this.get('id')
      const title = this.get('title')
      return `spaces/${id}/${kebabCase(title)}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `s/${this.get('id')}`
    })

  return schema
}
