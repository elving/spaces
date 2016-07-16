import set from 'lodash/set'

export default (res, metadata) => {
  set(res, 'locals.metadata', metadata)
  return res
}
