import sanitize from './sanitize'
import findBySid from './findBySid'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const color = await findBySid(sid, true)

      color.set(sanitize(props))
      color.save(async (err) => {
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
