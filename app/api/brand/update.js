import sanitize from './sanitize'
import findBySid from './findBySid'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const brand = await findBySid(sid, true)

      brand.set(sanitize(props))
      brand.save(async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(brand.get('id'))
        resolve(brand)
      })
    } catch (err) {
      reject(err)
    }
  })
}
