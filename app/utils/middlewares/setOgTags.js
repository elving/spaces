import set from 'lodash/set'

export default (res, ogTags) => {
  set(res, 'locals.og', ogTags)
  return res
}
