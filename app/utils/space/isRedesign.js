import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

export default (space) => (
  !isEmpty(get(space, 'originalSpace'))
)
