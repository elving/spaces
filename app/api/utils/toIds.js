import map from 'lodash/map'
import isArray from 'lodash/isArray'
import flattenDeep from 'lodash/flattenDeep'

import toStringId from './toStringId'

export default (docs) => {
  docs = isArray(docs) ? docs : [docs]
  return flattenDeep(map(docs, toStringId))
}
