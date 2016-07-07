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

import { default as findColorByName } from '../color/findByName'
import { default as getOrCreateBrand } from '../brand/getOrCreate'
import { default as getOrCreateCategory } from '../category/getOrCreate'
import { default as findSpaceTypeByName } from '../spaceType/findByName'

export default (id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      let brand = null
      let colors = []
      let categories = []
      let spaceTypes = []

      const product = await findById(id)
      const sanitizedProps = sanitize(props)

      if (has(sanitizedProps, 'brand')) {
        try {
          brand = await getOrCreateBrand(get(sanitizedProps, 'brand'), true)
          set(sanitizedProps, 'brand', toStringId(brand))
        } catch (err) {
          if (has(err, 'name')) {
            return reject({ brand: get(err, 'name') })
          } else {
            return reject({
              generic: (
                'There was an error while trying to create this product. ' +
                'Please try again.'
              )
            })
          }
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
        } catch (err) {
          if (has(err, 'name')) {
            return reject({ categories: get(err, 'name') })
          } else {
            return reject({
              generic: (
                'There was an error while trying to create this product. ' +
                'Please try again.'
              )
            })
          }
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
          } else {
            return reject({
              generic: (
                'There was an error while trying to create this product. ' +
                'Please try again.'
              )
            })
          }
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
        } catch (err) {
          if (has(err, 'name')) {
            return reject({ spaceTypes: get(err, 'name') })
          } else {
            return reject({
              generic: (
                'There was an error while trying to create this product. ' +
                'Please try again.'
              )
            })
          }
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
}
