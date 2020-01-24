import get from 'lodash/get'
import map from 'lodash/map'
import isArray from 'lodash/isArray'
import compact from 'lodash/compact'
import flattenDeep from 'lodash/flattenDeep'

import toIds from './toIds'

export default (docs, path = 'id') => (
  compact(
    map(
      flattenDeep(isArray(docs) ? docs : [docs]),
      doc => toIds(get(doc, path, doc))
    )
  )
)
