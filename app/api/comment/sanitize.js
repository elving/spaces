import omit from 'lodash/omit'

export default (props) => {
  return omit(props, ['_csrf', '_method'])
}
