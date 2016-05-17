import findBySid from './findBySid'

import { toIds, parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await findBySid(sid, true)
      const id = product.get('id')
      const brand = product.get('brand')
      const colors = product.get('colors')
      const categories = product.get('categories')
      const spaceTypes = product.get('spaceTypes')

      product.remove(async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache([
          id, toIds(brand), toIds(colors),
          toIds(categories), toIds(spaceTypes)
        ])

        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}
