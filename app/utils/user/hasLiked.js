import get from 'lodash/get'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

export default (user, parent) => (
  !isEmpty(find(get(user, 'likes', []), (like) => (
    isEqual(get(like, 'parent', like), parent)
  )))
)
