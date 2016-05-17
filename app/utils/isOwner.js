import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

export default (user, model) => (
  !isEmpty(user) &&
  !isEmpty(get(user, 'id')) &&
  isEqual(get(user, 'id'), get(model, 'createdBy'))
)
