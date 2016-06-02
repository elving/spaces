import get from 'lodash/get'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

export default (user, space) => (
  !isEmpty(find(get(user, 'spacesLiked', []), (id) => (
    isEqual(id, space)
  )))
)
