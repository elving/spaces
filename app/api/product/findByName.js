import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (name, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `product-${kebabCase(name)}`
    const query = () => {
      mongoose
        .model('Produt')
        .findOne({ name })
        .exec(async (err, product) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(product)) {
            await saveToCache(key, toJSON(product), [
              toIds(product),
              toIdsFromPath(product, 'brand'),
              toIdsFromPath(product, 'colors'),
              toIdsFromPath(product, 'categories'),
              toIdsFromPath(product, 'spaceTypes')
            ])

            resolve(product)
          } else {
            resolve()
          }
        })
    }

    if (returnDocument) {
      query()
    } else {
      getFromCacheOrQuery(key, query, resolve)
    }
  })
}
