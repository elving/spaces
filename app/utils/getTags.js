import get from 'lodash/get'
import map from 'lodash/map'
import concat from 'lodash/concat'

import toStringId from '../api/utils/toStringId'

export default model => (
  map(concat(
    get(model, 'colors', []),
    get(model, 'categories', []),
    get(model, 'spaceTypes', [])
  ), tag => {
    let url = `/${get(tag, 'detailUrl', '')}/`
    const id = toStringId(tag)
    const type = get(tag, 'type', '')

    if (type === 'color') {
      url = `/search/?type=${get(model, 'type')}s&colors=${id}`
    }

    return {
      id,
      url,
      type,
      name: get(tag, 'name', '')
    }
  })
)
