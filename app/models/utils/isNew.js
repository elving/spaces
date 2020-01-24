import result from 'lodash/result'
import isQuery from './isQuery'

export default source => (
  !isQuery(source)
    ? result(source, 'isNew', false)
    : false
)
