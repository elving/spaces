import has from 'lodash/has'
import set from 'lodash/set'
import get from 'lodash/get'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'

export default (props) => {
  const errors = {}
  const description = get(props, 'description')

  if (!has(props, 'name') || isEmpty(get(props, 'name'))) {
    set(errors, 'name', 'A name is required to add a room')
  }

  if (!isEmpty(description) && size(description) > 500) {
    set(errors, 'description', (
      'The product\'s description can\'t be longer than 500 characters'
    ))
  }

  return errors
}
