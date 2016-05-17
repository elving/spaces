import sanitize from './sanitize'
import findBySid from './findBySid'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await findBySid(sid, true)

      category.set(sanitize(props))
      category.save(async (err) => {
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
