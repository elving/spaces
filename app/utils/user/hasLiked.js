import get from 'lodash/get'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

export default (user, parent) => (
  !isEmpty(find(get(user, 'likes', []), like =>
    get(like, 'parent', like) === parent
  ))
)
