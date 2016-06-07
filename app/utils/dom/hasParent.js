import get from 'lodash/get'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

export default (event, selector) => (
  !isEmpty(
    find(get(event, 'path', []), (element) => (
      find(get(element, 'classList', []), (className) => (
        isEqual(className, selector)
      ))
    ))
  )
)
