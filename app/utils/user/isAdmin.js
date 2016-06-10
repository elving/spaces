import get from 'lodash/get'

export default (user = {}) => get(user, 'isAdmin', false)
