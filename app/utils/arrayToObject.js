import get from 'lodash/get'
import forEach from 'lodash/forEach'

export default (array, key = 'id') => {
  const object = {}
  forEach(array, (item) => object[get(item, key, '')] = item)
  return object
}
