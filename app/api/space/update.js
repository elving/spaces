import has from 'lodash/has'
import mongoose from 'mongoose'

import toIds from '../../api/utils/toIds'
import sanitize from './sanitize'
import toIdsFromPath from '../../api/utils/toIdsFromPath'
import generateImage from '../../utils/image/generateImage'

import parseError from '../utils/parseError'
import getProductImages from '../utils/getProductImages'
import { invalidateFromCache } from '../cache'

export default (_id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shouldUpdateImage = has(props, 'products')
      const updates = sanitize(props)
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
                  const images = getProductImages(space.get('products'))

                  generateImage('spaces', images)
                    .then((image) => {
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
