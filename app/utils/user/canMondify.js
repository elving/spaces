import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

export default (user, model) => (
  get(user, 'isAdmin', false) ||
  isEqual(get(user, 'id', ''), get(model, 'createdBy', ''))
)
