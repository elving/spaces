import sanitize from './sanitize'
import findById from './findById'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const brand = await findById(id)

      brand.update(sanitize(props, false), async (err) => {
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
