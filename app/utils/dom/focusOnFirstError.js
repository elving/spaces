import result from 'lodash/result'
import isEmpty from 'lodash/isEmpty'

import $ from './selector'

export default () => {
  const $err = $('.textfield--error')

  if (!isEmpty($err)) {
    result($err, 'focus')
  }
}
