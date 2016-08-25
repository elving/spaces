import get from 'lodash/get'
import set from 'lodash/set'
import map from 'lodash/map'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import { default as searchProducts } from '../product/search'

const getSpaces = createdBy => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .where({ createdBy })
      .populate({
        path: 'spaceType',
        options: {
          populate: 'categories'
        }
      })
      .populate('categories')
      .exec((err, spaces = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(spaces)
      })
  })
)

export default user => (
  new Promise(async (resolve, reject) => {
    try {
      const spaces = await getSpaces(user)
      const hasSpaces = !isEmpty(spaces)
      let spacesWithSuggestions = []

      if (hasSpaces) {
        for (const space of spaces) {
          const categories = get(space, 'spaceType.categories', [])

          if (!isEmpty(categories)) {
            const productsSearch = await searchProducts({
              sort: '-likesCount -updatedAt',
              limit: 12,
              categories: map(categories, 'id')
            }, 'and')

            const products = get(productsSearch, 'results', [])

            if (!isEmpty(products)) {
              set(space, 'products', products)

              spacesWithSuggestions = concat(
                [], spacesWithSuggestions, space
              )
            }
          }
        }
      }

      resolve({
        spaces: spacesWithSuggestions,
        hasSpaces
      })
    } catch (err) {
      reject(err)
    }
  })
)
