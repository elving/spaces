import set from 'lodash/set'
import get from 'lodash/get'
import omit from 'lodash/omit'
import split from 'lodash/split'
import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'

export default props => {
  const name = get(props, 'name', '')
  const categories = get(props, 'categories', '')

  if (!isEmpty(name)) {
    set(props, 'name', startCase(name))
  }

  if (!isEmpty(categories)) {
    set(props, 'categories', split(categories, ','))
  }

  return omit(props, ['_csrf', '_method'])
}
