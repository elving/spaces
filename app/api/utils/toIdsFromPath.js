import get from 'lodash/get'
import map from 'lodash/map'
import isArray from 'lodash/isArray'
import flattenDeep from 'lodash/flattenDeep'

import toIds from './toIds'

export default (docs, path) => {
  docs = isArray(docs) ? docs : [docs]
  return flattenDeep(map(docs, (doc) => toIds(get(doc, path, doc))))
}
