import set from 'lodash/set'

export default (res, props) => {
  set(res, 'locals.props', props)
  return res
}
