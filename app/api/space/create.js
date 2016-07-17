import has from 'lodash/has'
import assign from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import getTags from '../../utils/product/getTags'
import sanitize from './sanitize'
import logError from '../../utils/logError'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import generateImage from '../../utils/image/generateImage'
import getProductImages from '../utils/getProductImages'
import { removeFromCache, invalidateFromCache } from '../cache'

export default props => (
  new Promise(async (resolve, reject) => {
    const Space = mongoose.model('Space')

    let products = []
    let updatedProps = sanitize(props)
    let shouldUpdateImage = false

    if (has(updatedProps, 'products')) {
      try {
        products = await getProducts(updatedProps.products)
        updatedProps = assign({}, updatedProps, getTags(products))
        shouldUpdateImage = true
      } catch (getProductsErr) {
        return reject(getProductsErr)
      }
    }

    const space = new Space(updatedProps)
    const errors = space.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    space.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      space
        .populate('products')
        .populate('createdBy')
        .populate('spaceType')
        .populate('originalSpace', async (populationErr, populatedSpace) => {
          if (populationErr) {
            return reject(parseError(populationErr))
          }

          if (shouldUpdateImage) {
            try {
              const images = getProductImages(products)

              generateImage('spaces', images)
                .then((image) => {
                  populatedSpace
                    .set({ image })
                    .save(() => invalidateFromCache(toIds(populatedSpace)))
                })
            } catch (generateImageErr) {
              logError(generateImageErr)
            }
          }

          await removeFromCache('space-all')
          await removeFromCache('space-latest')

          resolve(populatedSpace)
        })
    })
  })
)
