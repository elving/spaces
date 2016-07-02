import set from 'lodash/set'
import get from 'lodash/get'
import map from 'lodash/map'
import forEach from 'lodash/forEach'

import toStringId from '../toStringId'

export default (spaces) => {
  const hashTable = {}

  forEach(spaces, space => {
    const products = get(space, 'products', [])
    set(hashTable, toStringId(space), map(products, toStringId))
  })

  return hashTable
}
