import set from 'lodash/set'
import get from 'lodash/get'
import omit from 'lodash/omit'
import split from 'lodash/split'
import isEmpty from 'lodash/isEmpty'
import accounting from 'accounting'

export default (props) => {
  const price = get(props, 'price', '')
  const colors = get(props, 'colors', '')
  const categories = get(props, 'categories', '')
  const spaceTypes = get(props, 'spaceTypes', '')

  if (!isEmpty(price)) {
    set(props, 'price', accounting.unformat(price))
  }

  if (!isEmpty(colors)) {
    set(props, 'colors', split(colors, ','))
  }

  if (!isEmpty(categories)) {
    set(props, 'categories', split(categories, ','))
  }

  if (!isEmpty(spaceTypes)) {
    set(props, 'spaceTypes', split(spaceTypes, ','))
  }

  return omit(props, ['_csrf', '_method'])
}
