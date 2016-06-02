import sanitize from './sanitize'
import findBySid from './findBySid'

import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (sid, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spaceType = await findBySid(sid, true)

      spaceType.set(sanitize(props, false))

      spaceType.save(async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(spaceType.get('id'))
        resolve(spaceType)
      })
    } catch (err) {
      reject(err)
    }
  })
}
