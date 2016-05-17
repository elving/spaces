import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

export default (user) => (
  !isEmpty(user) && !isEmpty(get(user, 'id')) && get(user, 'isAdmin')
)
