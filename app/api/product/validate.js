import has from 'lodash/has'
import set from 'lodash/set'
import get from 'lodash/get'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'

export default (props) => {
  const errors = {}
  const description = get(props, 'description')

  if (!has(props, 'url') || isEmpty(get(props, 'url'))) {
    set(errors, 'url', 'A url is required to add a product')
  }

  if (!has(props, 'name') || isEmpty(get(props, 'name'))) {
    set(errors, 'name', 'A name is required to add a product')
  }

  if (!has(props, 'price') || !isNumber(get(props, 'price'))) {
    set(errors, 'price', 'A price is required to add a product')
  }

  if (!has(props, 'image') || isEmpty(get(props, 'image'))) {
    set(errors, 'image', 'An image is required to add a product')
  }

  if (!has(props, 'brand') || isEmpty(get(props, 'brand'))) {
    set(errors, 'brand', 'A brand is required to add a product')
  }

  if (!has(props, 'categories') || isEmpty(get(props, 'categories'))) {
    set(errors, 'categories', (
      'At least one category is required to add a product'
    ))
  }

  if (!has(props, 'spaceTypes') || isEmpty(get(props, 'spaceTypes'))) {
    set(errors, 'spaceTypes', (
      'At least one space type is required to add a product'
    ))
  }

  if (!isEmpty(description) && size(description) > 500) {
    set(errors, 'description', (
      'The product\'s description can\'t be longer than 500 characters'
    ))
  }

  return errors
}
