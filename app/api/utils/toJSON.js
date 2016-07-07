import map from 'lodash/map'
import result from 'lodash/result'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

export default (value) => {
  return isArray(value) ? map(value, (doc) => (
    result(doc, 'toJSON', (!isEmpty(doc) ? doc : {}))
  )) : (
    result(value, 'toJSON', (!isEmpty(value) ? value : {}))
  )
}
