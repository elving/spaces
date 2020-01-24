import set from 'lodash/set'
import get from 'lodash/get'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'

import toIds from '../utils/toIds'
import toStringId from '../utils/toStringId'

export default props => {
  const products = get(props, 'products', [])
  const spaceType = get(props, 'spaceType', '')

  if (!isEmpty(products)) {
    set(props, 'products', toIds(products))
  }

  if (!isEmpty(spaceType)) {
    set(props, 'spaceType', toStringId(spaceType))
  }

  return omit(props, ['_csrf', '_method'])
}
