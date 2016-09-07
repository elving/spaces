import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import update from './update'
import toStringId from '../utils/toStringId'
import toObjectId from '../utils/toObjectId'
import parseError from '../utils/parseError'

import { invalidateFromCache } from '../cache'

export default (_id) => (
  new Promise(async (resolve, reject) => {
    mongoose
      .model('Space')
      .findOneAndRemove({ _id }, async (err, space) => {
        if (err) {
          return reject(parseError(err))
        }

        const originalSpace = get(space, 'originalSpace')

        if (!isEmpty(originalSpace)) {
          try {
            await update(toStringId(originalSpace), {
              $inc: { redesignsCount: -1 },
              $pull: { redesigns: toObjectId(space) }
            })
          } catch (originalSpaceErr) {
            return reject(parseError(originalSpaceErr))
          }
        }

        await invalidateFromCache([
          _id,
          toIds(get(space, 'products')),
          toIds(get(space, 'redesigns'))
        ])

        resolve()
      })
  })
)
