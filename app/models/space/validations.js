import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'

export default schema => {
  schema
    .path('name')
    .required(true, 'A name is required to create a space')

  schema
    .path('name')
    .validate((value) => {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 120) {
        return true
      }

      return false
    }, 'The space\'s description can\'t be longer than 120 characters')

  schema
    .path('spaceType')
    .required(true, 'A type is required to create a space')

  schema
    .path('description')
    .validate((value) => {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 250) {
        return true
      }

      return false
    }, 'The space\'s description can\'t be longer than 250 characters')
}
