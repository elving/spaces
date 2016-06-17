import set from 'lodash/set'
import get from 'lodash/get'
import map from 'lodash/map'
import forEach from 'lodash/forEach'

import toStringId from '../toStringId'

export default (spaces) => {
  const hashMap = {}

  forEach(spaces, (space) => {
    const products = get(space, 'products', [])
    set(hashMap, toStringId(space), map(products, toStringId))
  })

  return hashMap
}
