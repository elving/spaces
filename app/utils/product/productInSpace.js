import get from 'lodash/get'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

import toStringId from '../toStringId'

export default (map, space, productId) => (
  !isEmpty(find(get(map, toStringId(space), []), (product) => (
    isEqual(toStringId(product), toStringId(productId))
  )))
)
