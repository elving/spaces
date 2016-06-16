import get from 'lodash/get'
import result from 'lodash/result'
import isEqual from 'lodash/isEqual'

export default (user, model) => {
  const userId = get(user, 'id', user)
  const createdBy = get(model, 'createdBy.id', get(model, 'createdBy', model))

  return (
    get(user, 'isAdmin', false) ||
    isEqual(
      result(userId, 'toString', userId),
      result(createdBy, 'toString', createdBy)
    )
  )
}
