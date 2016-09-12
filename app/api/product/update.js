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
import { invalidateFromCache } from '../cache'

import updateRoom from '../spaceType/update'
import updateCategory from '../category/update'

import { default as findColorByName } from '../color/findByName'
import { default as getOrCreateBrand } from '../brand/getOrCreate'
import { default as getOrCreateCategory } from '../category/getOrCreate'
import { default as findSpaceTypeByName } from '../spaceType/findByName'

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

          const prevCategories = toIds(get(product, 'categories', []))
          const nextCategories = toIds(get(sanitizedProps, 'categories', []))

          for (const prevCategory of prevCategories) {
            await updateCategory(prevCategory, {
              $inc: { productsCount: -1 }
            })
          }

          for (const nextCategory of nextCategories) {
            await updateCategory(nextCategory, {
              $inc: { productsCount: 1 }
            })
          }
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

          const prevRooms = toIds(get(product, 'spaceTypes', []))
          const nextRooms = toIds(get(sanitizedProps, 'spaceTypes', []))

          for (const prevRoom of prevRooms) {
            await updateRoom(prevRoom, {
              $inc: { productsCount: -1 }
            })
          }

          for (const nextRoom of nextRooms) {
            await updateRoom(nextRoom, {
              $inc: { productsCount: 1 }
            })
          }
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

            await invalidateFromCache([
              toIds(product),
              toIdsFromPath(product, 'brand'),
              toIdsFromPath(product, 'colors'),
              toIdsFromPath(product, 'categories'),
              toIdsFromPath(product, 'spaceTypes')
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

          await invalidateFromCache([
            toIds(product),
            toIdsFromPath(product, 'brand'),
            toIdsFromPath(product, 'colors'),
            toIdsFromPath(product, 'categories'),
            toIdsFromPath(product, 'spaceTypes')
          ])

          resolve(product)
        })
      }
    } catch (err) {
      reject(err)
    }
  })
)
