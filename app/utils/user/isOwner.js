import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

import toStringId from '../../api/utils/toStringId'

export default (user, model) => (
  !isEmpty(toStringId(user)) &&
  isEqual(toStringId(user), get(model, 'createdBy'))
)
