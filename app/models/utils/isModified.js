import get from 'lodash/get'
import has from 'lodash/has'
import result from 'lodash/result'
import isUndefined from 'lodash/isUndefined'

import isQuery from './isQuery'

export default (source, path) => {
  let isModified = false

  if (isQuery(source)) {
    isModified = !isUndefined(
      get(result(source, 'getUpdate', {}), `$set.${path}`)
    )
  } else if (has(source, 'isModified')) {
    isModified = source.isModified(path)
  }

  return isModified
}
