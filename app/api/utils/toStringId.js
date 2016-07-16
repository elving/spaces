import get from 'lodash/get'
import result from 'lodash/result'
import isString from 'lodash/isString'
import constant from 'lodash/constant'

export default (model, path = 'id') => {
  if (isString(model)) {
    return model
  }

  const id = path === 'id'
    ? get(model, path, model)
    : get(model, `${path}.id`, model)

  return isString(id)
    ? id
    : result(id, 'toString', constant(id))
}
