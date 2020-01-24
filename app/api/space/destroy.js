import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { removeFromCache, invalidateFromCache } from '../cache'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .findOneAndRemove({ _id }, async (err, space) => {
        if (err) {
          return reject(parseError(err))
        }

        await removeFromCache('space-all')
        await removeFromCache('space-latest')
        await removeFromCache('space-popular-8')
        await removeFromCache(`redesigns-all-${_id}`)

        await invalidateFromCache([
          _id,
          toIdsFromPath(space, 'products'),
          toIdsFromPath(space, 'createdBy'),
          toIdsFromPath(space, 'spaceType'),
          toIdsFromPath(space, 'redesigns'),
          toIdsFromPath(space, 'categories'),
          toIdsFromPath(space, 'originalSpace')
        ])

        resolve()
      })
  })
)
