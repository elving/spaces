import get from 'lodash/get'
import filter from 'lodash/filter'

export default types => (
  filter(types, type => get(type, 'name') !== 'Any')
)
