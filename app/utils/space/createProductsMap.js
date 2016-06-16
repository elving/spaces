import set from 'lodash/set'
import get from 'lodash/get'
import forEach from 'lodash/forEach'

import toStringId from '../toStringId'

export default (spaces) => {
  const map = {}

  forEach(spaces, (space) => {
    set(map, toStringId(space), get(space, 'products', []))
  })

  return map
}
