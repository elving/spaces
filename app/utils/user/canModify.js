import get from 'lodash/get'

import isOwner from './isOwner'

export default (user, model) => (
  get(user, 'isAdmin', false) || isOwner(user, model)
)
