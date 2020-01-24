import get from 'lodash/get'
import trim from 'lodash/trim'
import filter from 'lodash/filter'
import toLower from 'lodash/toLower'
import isEmpty from 'lodash/isEmpty'
import startsWith from 'lodash/startsWith'

export default (collection, key, value) => {
  const term = toLower(trim(value))
  const regexp = new RegExp(term)

  if (!isEmpty(value)) {
    return filter(collection, (item) => {
      const itemValue = toLower(get(item, key, ''))
      return startsWith(itemValue, term) || regexp.test(itemValue)
    })
  } else {
    return []
  }
}
