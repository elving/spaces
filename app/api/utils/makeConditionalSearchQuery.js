import reduce from 'lodash/reduce'
import concat from 'lodash/concat'

export default params => (
  reduce(params, (result, value, key) => (
    concat([], result, { [key]: value })
  ), [])
)
