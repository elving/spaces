import get from 'lodash/get'
import result from 'lodash/result'

export default (object, path = 'id') => {
  const id = get(object, `${path}.id`, get(object, path, object))
  return result(id, 'toString', id)
}
