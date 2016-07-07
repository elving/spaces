import get from 'lodash/get'
import keys from 'lodash/keys'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'

export default (err) => {
  const errors = get(err, 'errors')
  const fieldErrors = {}

  if (!isEmpty(errors)) {
    forEach(keys(errors), field => {
      const fieldName = field === 'hashedPassword' ? 'password' : field

      fieldErrors[fieldName] = get(
        errors[field], 'message', 'Something went wrong...'
      )
    })

    return fieldErrors
  } else {
    return err
  }
}
