import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import toStringId from '../../api/utils/toStringId'

export default (user, model) => (
  !isEmpty(toStringId(user)) &&
  toStringId(user) === get(model, 'createdBy')
)
