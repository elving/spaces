import sanitize from './sanitize'
import findById from './findById'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await findById(id)

      category.update(sanitize(props, false), async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(category.get('id'))
        resolve(category)
      })
    } catch (err) {
      reject(err)
    }
  })
}
