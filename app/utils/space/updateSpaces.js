import get from 'lodash/get'
import set from 'lodash/set'
import clone from 'lodash/clone'

import toStringId from '../toStringId'

export default (spaces, space) => {
  const updatedSpaces = clone(spaces)
  set(updatedSpaces, toStringId(space), get(space, 'products', []))
  return updatedSpaces
}
