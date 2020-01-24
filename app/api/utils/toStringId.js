import get from 'lodash/get'
import result from 'lodash/result'
import isString from 'lodash/isString'
import isBuffer from 'lodash/isBuffer'
import constant from 'lodash/constant'

export default (model, path = 'id') => {
  let id

  if (isString(model)) {
    return model
  }

  id = path === 'id'
    ? get(model, path, model)
    : get(model, `${path}.id`, model)

  if (isBuffer(id)) {
    id = get(model, 'str', model)
  }

  const idToString = isString(id)
    ? id
    : result(id, 'toString', constant(id))

  return idToString === '[object Object]'
    ? null
    : idToString
}
