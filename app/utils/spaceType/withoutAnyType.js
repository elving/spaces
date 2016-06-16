import get from 'lodash/get'
import filter from 'lodash/filter'
import isEqual from 'lodash/isEqual'

export default (types) => (
  filter(types, (type) => !isEqual(get(type, 'name'), 'Any'))
)
