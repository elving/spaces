import get from 'lodash/get'
import map from 'lodash/map'
import compact from 'lodash/compact'
import flattenDeep from 'lodash/flattenDeep'

export default (collection, key) => (
  flattenDeep(compact(map(collection, (item) => get(item, key))))
)
