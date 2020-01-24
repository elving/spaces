import get from 'lodash/get'

import isAdmin from './isAdmin'

export default (user = {}) => isAdmin(user) || get(user, 'isCurator', false)
