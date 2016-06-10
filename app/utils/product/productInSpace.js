import get from 'lodash/get'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isString from 'lodash/isString'

export default (id, space) => (
  !isEmpty(find(get(space, 'products', []), (product) => (
    isString(product)
      ? isEqual(product, id)
      : isEqual(get(product, 'id', ''), id)
  )))
)
