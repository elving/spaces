import get from 'lodash/get'
import set from 'lodash/set'
import forEach from 'lodash/forEach'

export default (spaces) => {
  const map = {}

  forEach(spaces, (space) => {
    set(map, get(space, 'id', space), get(space, 'products', []))
  })

  return map
}
