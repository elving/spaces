import isAdmin from './isAdmin'
import isOwner from './isOwner'

export default (user, model) => (
  isAdmin(user) || isOwner(user, model)
)
