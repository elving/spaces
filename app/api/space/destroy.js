import findBySid from './findBySid'

import { toIds, parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const space = await findBySid(sid, true)
      const id = space.get('id')
      const products = space.get('products')
      const redesigns = space.get('redesigns')

      space.remove(async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache([
          id, toIds(products), toIds(redesigns)
        ])

        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}
