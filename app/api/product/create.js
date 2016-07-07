import has from 'lodash/has'
import set from 'lodash/set'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import validate from './validate'
import sanitize from './sanitize'
import uploadImageFromUrl from '../../utils/image/uploadImageFromUrl'

import toIds from '../utils/toIds'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import { removeFromCache } from '../cache'

import { default as findColorByName } from '../color/findByName'
import { default as getOrCreateBrand } from '../brand/getOrCreate'
import { default as getOrCreateCategory } from '../category/getOrCreate'
import { default as findSpaceTypeByName } from '../spaceType/findByName'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    let brand = null
    let colors = []
    let categories = []
    let spaceTypes = []

    const sanitizedProps = sanitize(props)
    const Product = mongoose.model('Product')
    const propErrors = validate(sanitizedProps)

    if (!isEmpty(propErrors)) {
      return reject(propErrors)
    }

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

    const product = new Product(sanitizedProps)
    const validationErrors = product.validateSync()

    if (!isEmpty(validationErrors)) {
      return reject(parseError(validationErrors))
    }

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
  })
}
