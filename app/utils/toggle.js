import concat from 'lodash/concat'
import without from 'lodash/without'
import includes from 'lodash/includes'

export default (collection, value) => (
  includes(collection, value)
    ? without(collection, value)
    : concat([], collection, value)
)
