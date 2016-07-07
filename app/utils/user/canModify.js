import get from 'lodash/get'
import result from 'lodash/result'
import isEqual from 'lodash/isEqual'

import toStringId from '../../api/utils/toStringId'

export default (user, model) => {
  const userId = toStringId(user)
  const createdBy = get(model, 'createdBy.id', get(model, 'createdBy', model))

  return (
    get(user, 'isAdmin', false) ||
    isEqual(
      result(userId, 'toString', userId),
      result(createdBy, 'toString', createdBy)
    )
  )
}
