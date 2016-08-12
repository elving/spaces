import has from 'lodash/has'
import assign from 'lodash/assign'
import mongoose from 'mongoose'

import toIds from '../../api/utils/toIds'
import getTags from '../../utils/product/getTags'
import sanitize from './sanitize'
import logError from '../../utils/logError'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import toIdsFromPath from '../../api/utils/toIdsFromPath'
import generateImage from '../../utils/image/generateImage'
import getProductImages from '../utils/getProductImages'
import { invalidateFromCache } from '../cache'

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    try {
      let updates = sanitize(props)
      let products = []
      let shouldUpdateImage = false
      const options = {
        new: true,
        runValidators: true
      }

      if (has(updates, 'products')) {
        try {
          products = await getProducts(updates.products)
          updates = assign({}, updates, getTags(products))
          shouldUpdateImage = true
        } catch (getProductsErr) {
          return reject(getProductsErr)
        }
      }

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
            .populate('createdBy')
            .populate('spaceType', (populationErr, populatedSpace) => {
              if (populationErr) {
                return reject(parseError(err))
              }

              if (shouldUpdateImage) {
                try {
                  const images = getProductImages(products)

                  generateImage('spaces', images)
                    .then((image) => {
                      populatedSpace
                        .set({ image })
                        .save(() => invalidateFromCache(toIds(space)))
                    })
                } catch (generateImageErr) {
                  logError(generateImageErr)
                }
              }

              resolve(populatedSpace)
            })
        })
    } catch (err) {
      reject(err)
    }
  })
)
