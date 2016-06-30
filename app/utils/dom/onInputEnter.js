import get from 'lodash/get'

export default (event, next = (() => {})) => {
  if (get(event, 'keyCode', 0) === 13) {
    next(event)
  }
}
