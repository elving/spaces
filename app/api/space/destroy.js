import get from 'lodash/get'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import parseError from '../utils/parseError'
import { invalidateFromCache } from '../cache'

export default (_id) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('Space')
      .findOneAndRemove({ _id }, async (err, space) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache([
          _id,
          toIds(get(space, 'products')),
          toIds(get(space, 'redesigns'))
        ])

        resolve()
      })
  })
}
