import join from 'lodash/join'
import isError from 'lodash/isError'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import toString from 'lodash/toString'
import isPlainObject from 'lodash/isPlainObject'

export default (err) => {
  if (isString(err)) {
    return err
  } else if (isPlainObject(err)) {
    return JSON.stringify(err, null, 2)
  } else if (isArray(err)) {
    return join(err, '\n')
  } else if (isError(err)) {
    return err
  }

  return toString(err)
}
