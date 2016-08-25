import get from 'lodash/get'
import set from 'lodash/set'
import omit from 'lodash/omit'
import split from 'lodash/split'
import isEmpty from 'lodash/isEmpty'

export default props => {
  const categories = get(props, 'categories', '')

  if (!isEmpty(categories)) {
    set(props, 'categories', split(categories, ','))
  }

  return omit(props, ['_csrf', '_method'])
}
