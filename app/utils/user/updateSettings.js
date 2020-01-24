import get from 'lodash/get'
import assign from 'lodash/assign'

export default (user, settings) => {
  const originalSettings = get(user, 'settings', {})
  return assign({}, originalSettings, settings)
}
