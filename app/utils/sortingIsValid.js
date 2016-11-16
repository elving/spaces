import get from 'lodash/get'
import map from 'lodash/map'
import includes from 'lodash/includes'

import reverseKebabCase from './reverseKebabCase'

export default (all, current) => {
  const allMap = map(all, sort => get(sort, 'label'))
  return includes(allMap, reverseKebabCase(current))
}
