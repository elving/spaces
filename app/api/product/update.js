import has from 'lodash/has'
import set from 'lodash/set'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import sanitize from './sanitize'
import findById from './findById'
import uploadImageFromUrl from '../../utils/image/uploadImageFromUrl'

import toIds from '../utils/toIds'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'

import findColorByName from '../color/findByName'
import getOrCreateBrand from '../brand/getOrCreate'
import getOrCreateCategory from '../category/getOrCreate'
import findSpaceTypeByName from '../spaceType/findByName'
import { removeFromCache, invalidateFromCache } from '../../api/cache'

export default (id, props) => (
  new Promise(async (resolve, reject) => {
    try {
      let brand = null
      const colors = []
      const categories = []
      const spaceTypes = []

      const product = await findById(id)
      const sanitizedProps = sanitize(props)

      if (has(sanitizedProps, 'brand')) {
        try {
          brand = await getOrCreateBrand(get(sanitizedProps, 'brand'), true)
          set(sanitizedProps, 'brand', toStringId(brand))
        } catch (err) {
          if (has(err, 'name')) {
            return reject({ brand: get(err, 'name') })
          }

          return reject({
            generic: (
              'There was an error while trying to create this product. ' +
              'Please try again.'
            )
          })
        }
      }

      if (has(sanitizedProps, 'categories')) {
        try {
          for (let category of get(sanitizedProps, 'categories', [])) {
            category = await getOrCreateCategory(category, true)

            if (!isEmpty(category)) {
              categories.push(category)
            }
          }

          set(sanitizedProps, 'categories', toIds(categories))

          product.productCategories = toIds(get(product, 'categories', []))
          product.shouldUpdateCategories = true
        } catch (err) {
          if (has(err, 'name')) {
            return reject({ categories: get(err, 'name') })
          }

          return reject({
            generic: (
              'There was an error while trying to create this product. ' +
              'Please try again.'
            )
          })
        }
      }

      if (has(sanitizedProps, 'colors')) {
        try {
          for (let color of get(sanitizedProps, 'colors', [])) {
            color = await findColorByName(color, true)

            if (!isEmpty(color)) {
              colors.push(color)
            }
          }

          set(sanitizedProps, 'colors', toIds(colors))
        } catch (err) {
          if (has(err, 'name')) {
            return reject({ colors: get(err, 'name') })
          }

          return reject({
            generic: (
              'There was an error while trying to create this product. ' +
              'Please try again.'
            )
          })
        }
      }

      if (has(sanitizedProps, 'spaceTypes')) {
        try {
          for (let spaceType of get(sanitizedProps, 'spaceTypes', [])) {
            spaceType = await findSpaceTypeByName(spaceType, true)

            if (!isEmpty(spaceType)) {
              spaceTypes.push(spaceType)
            }
          }

          set(sanitizedProps, 'spaceTypes', toIds(spaceTypes))

          product.productRooms = toIds(get(product, 'spaceTypes', []))
          product.shouldUpdateRooms = true
        } catch (err) {
          if (has(err, 'name')) {
            return reject({ spaceTypes: get(err, 'name') })
          }

          return reject({
            generic: (
              'There was an error while trying to create this product. ' +
              'Please try again.'
            )
          })
        }
      }

      product.set(sanitizedProps)

      if (product.isModified('image')) {
        try {
          const imageUrl = await uploadImageFromUrl(
            'products', get(sanitizedProps, 'image')
          )

          product.set('image', imageUrl)

          product.save(async (err) => {
            if (err) {
              return reject(parseError(err))
            }

            await removeFromCache('brand-all')
            await removeFromCache('color-all')
            await removeFromCache('category-all')
            await removeFromCache('spaceType-all')
            await removeFromCache('product-all')
            await removeFromCache('product-latest')
            await removeFromCache('product-popular-8')
            await removeFromCache(`product-related-${id}`)
            await removeFromCache('product-popular-8-upcoming')

            await invalidateFromCache([
              id,
              toIdsFromPath(product, 'brand'),
              toIdsFromPath(product, 'spaceTypes'),
              toIdsFromPath(product, 'colors'),
              toIdsFromPath(product, 'categories'),
            ])

            resolve(product)
          })
        } catch (err) {
          return reject({
            generic: (
              'There was an error while uploading ' +
              'the product\'s image. Please try again.'
            )
          })
        }
      } else {
        product.save(async (err) => {
          if (err) {
            return reject(parseError(err))
          }

          const createdBy = toStringId(get(product, 'createdBy', {}))

          await removeFromCache('brand-all')
          await removeFromCache('color-all')
          await removeFromCache('category-all')
          await removeFromCache('spaceType-all')
          await removeFromCache('product-all')
          await removeFromCache('product-latest')
          await removeFromCache('product-popular-8')
          await removeFromCache('product-recommended')
          await removeFromCache(`product-related-${id}`)
          await removeFromCache('product-popular-8-upcoming')
          await removeFromCache(`product-recommended-${createdBy}`)

          await invalidateFromCache([
            id,
            toIdsFromPath(product, 'brand'),
            toIdsFromPath(product, 'spaceTypes'),
            toIdsFromPath(product, 'colors'),
            toIdsFromPath(product, 'categories'),
          ])

          resolve(product)
        })
      }
    } catch (err) {
      reject(err)
    }
  })
)
