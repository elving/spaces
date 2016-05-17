import set from 'lodash/set'
import get from 'lodash/get'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'

export default (props) => {
  const slug = get(props, 'slug', '')

  if (isEmpty(slug)) {
    set(props, 'slug', kebabCase(get(props, 'name', '')))
  }

  return omit(props, ['_csrf', '_method'])
}
