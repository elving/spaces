import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import { removeFromCache, invalidateFromCache } from '../../api/cache'

export default (_id) => (
  new Promise(async (resolve, reject) => {
    mongoose
      .model('SpaceType')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        await removeFromCache('spaceType-all')
        await removeFromCache('spaceType-popular-8')
        await invalidateFromCache(_id)

        resolve()
      })
  })
)
