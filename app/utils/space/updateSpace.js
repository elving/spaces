import set from 'lodash/set'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

export default (userData, space) => {
  const data = cloneDeep(userData)
  const spaces = get(userData, 'spaces', {})

  set(spaces, get(space, 'id'), space)
  set(data, 'spaces', spaces)

  return data
}
