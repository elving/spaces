import findBySid from './findBySid'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spaceType = await findBySid(sid, true)
      const id = spaceType.get('id')

      spaceType.remove(async (err) => {
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
