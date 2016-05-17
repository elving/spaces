import findBySid from './findBySid'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const brand = await findBySid(sid, true)
      const id = brand.get('id')

      brand.remove(async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(id)
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}
