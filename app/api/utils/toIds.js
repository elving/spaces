import map from 'lodash/map'
import isArray from 'lodash/isArray'
import compact from 'lodash/compact'
import flattenDeep from 'lodash/flattenDeep'

import toStringId from './toStringId'

export default docs => (
  compact(
    map(
      flattenDeep(isArray(docs) ? docs : [docs]),
      doc => toStringId(doc)
    )
  )
)
