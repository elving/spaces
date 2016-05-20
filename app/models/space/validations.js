import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'

export default (schema) => {
  schema
    .path('name')
    .required(true, 'A name is required to create a space')

  schema
    .path('description')
    .validate((value) => {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 500) {
        return true
      } else {
        return false
      }
    }, 'The space\'s description can\'t be longer than 500 characters')
}
