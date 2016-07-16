import get from 'lodash/get'
import map from 'lodash/map'
import concat from 'lodash/concat'
import uniqBy from 'lodash/uniqBy'
import compact from 'lodash/compact'

import toStringId from '../api/utils/toStringId'

export default model => (
  uniqBy(
    map(compact(concat(
      get(model, 'colors', []),
      get(model, 'categories', []),
      get(model, 'spaceTypes', [])
    )), tag => ({
      id: toStringId(tag),
      url: `/${get(tag, 'detailUrl', '')}/`,
      name: get(tag, 'name', ''),
      type: get(tag, 'type', '')
    })), 'id'
  )
)
