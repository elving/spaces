import has from 'lodash/has'
import get from 'lodash/get'
import map from 'lodash/map'
import compact from 'lodash/compact'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import generateHeader from '../../utils/space/generateHeader'

import { invalidateFromCache } from '../cache'
import { toIds, parseError, toIdsFromPath } from '../utils'

export default (_id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shouldUpdateImage = has(props, 'products')
      const updates = sanitize(props, false)
      const options = { new: true }

      mongoose
        .model('Space')
        .findOneAndUpdate({ _id }, updates, options, async (err, space) => {
          if (err) {
            return reject(parseError(err))
          }

          space.set('forcedUpdate', false)

          await invalidateFromCache([
            toIds(space),
            toIdsFromPath(space, 'products'),
            toIdsFromPath(space, 'createdBy'),
            toIdsFromPath(space, 'spaceType'),
            toIdsFromPath(space, 'redesigns'),
            toIdsFromPath(space, 'originalSpace')
          ])

          space
            .populate('products')
            .populate('createdBy')
            .populate('spaceType', (err, space) => {
              if (err) {
                return reject(parseError(err))
              }

              if (shouldUpdateImage) {
                try {
                  generateHeader(
                    compact(map(space.get('products'), (product) => (
                      get(product, 'image')
                    )))
                  ).then((image) => {
                    space.set({ image })
                    space.save(() => invalidateFromCache(toIds(space)))
                  })
                } catch (err) {

                }
              }

              resolve(space)
            })
        })
    } catch (err) {
      reject(err)
    }
  })
}
