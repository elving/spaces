import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'

export default (schema) => {
  schema
    .path('parent')
    .required(true)

  schema
    .path('parentType')
    .required(true)

  schema
    .path('createdBy')
    .required(true)

  schema
    .path('content')
    .required(true)

  schema
    .path('content')
    .validate((value) => {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 500) {
        return true
      } else {
        return false
      }
    }, 'Maximum 500 characters')

  return schema
}
