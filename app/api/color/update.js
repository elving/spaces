import sanitize from './sanitize'
import findById from './findById'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const color = await findById(id)

      color.update(sanitize(props, false), async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(color.get('id'))
        resolve(color)
      })
    } catch (err) {
      reject(err)
    }
  })
}
