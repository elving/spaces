import get from 'lodash/get'
import set from 'lodash/set'
import map from 'lodash/map'
import filter from 'lodash/filter'
import concat from 'lodash/concat'
import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import toStringId from '../utils/toStringId'
import toIdsFromPath from '../utils/toIdsFromPath'
import searchProducts from '../product/search'

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
              sort: '-createdAt -likesCount -commentsCount',
              limit: 16,
              categories: map(categories, 'id')
            }, 'and')

            const products = get(productsSearch, 'results', [])

            if (!isEmpty(products)) {
              set(space, 'products', filter(products, product =>
                !includes(
                  flatten(toIdsFromPath(space, 'products')),
                  toStringId(product)
                )
              ))

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
