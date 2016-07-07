import set from 'lodash/set'
import get from 'lodash/get'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'

import toObjectId from '../utils/toObjectId'

export default (props, isNew = true) => {
  const slug = get(props, 'slug', '')
  const products = get(props, 'products', '')
  const spaceType = get(props, 'spaceType', '')

  if (isNew) {
    if (isEmpty(slug)) {
      set(props, 'slug', kebabCase(get(props, 'name', '')))
    }
  }

  if (!isEmpty(products)) {
    set(props, 'products', toObjectId(products))
  }

  if (!isEmpty(spaceType)) {
    set(props, 'spaceType', toObjectId(spaceType))
  }

  Reflect.deleteProperty(props, 'updatedByAdmin')
  return omit(props, ['_csrf', '_method'])
}
