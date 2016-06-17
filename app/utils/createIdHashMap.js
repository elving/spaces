import set from 'lodash/set'
import map from 'lodash/map'
import forEach from 'lodash/forEach'

import toStringId from './toStringId'

export default (object) => {
  const hashMap = {}

  forEach(object, (value, key) => {
    set(hashMap, key, map(value, toStringId))
  })

  return hashMap
}
