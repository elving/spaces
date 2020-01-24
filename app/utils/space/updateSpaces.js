import set from 'lodash/set'
import map from 'lodash/map'
import clone from 'lodash/clone'

import toStringId from '../../api/utils/toStringId'

export default (all, space, products) => {
  set(all, toStringId(space), map(products, toStringId))
  return clone(all)
}
