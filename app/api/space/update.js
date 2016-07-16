import get from 'lodash/get'
import has from 'lodash/has'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'
import mongoose from 'mongoose'

import toIds from '../../api/utils/toIds'
import sanitize from './sanitize'
import logError from '../../utils/logError'
import toObjectId from '../utils/toObjectId'
import toIdsFromPath from '../../api/utils/toIdsFromPath'
import generateImage from '../../utils/image/generateImage'

import parseError from '../utils/parseError'
import getProductImages from '../utils/getProductImages'
import { invalidateFromCache } from '../cache'

const getProducts = productIds => (
  new Promise(async (resolve, reject) => {
    mongoose
      .model('Product')
      .where({
        _id: { $in: productIds }
      })
      .exec((err, products = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(products)
      })
  })
)

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    try {
      let brands = []
      let colors = []
      let updates = sanitize(props)
      let products = []
      let categories = []
      let shouldUpdateImage = false
      const options = { new: true }

      if (has(updates, 'products')) {
        try {
          products = await getProducts(get(updates, 'products'))
          shouldUpdateImage = true

          forEach(products, (product = {}) => {
            brands = concat(brands, toObjectId(product.brand))
            colors = concat(colors, toObjectId(product.colors))
            categories = concat(categories, toObjectId(product.categories))
          })

          updates = assign({}, updates, {
            brands: compact(brands),
            colors: compact(colors),
            categories: compact(categories)
          })
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
