import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (limit = 8) => {
  return new Promise(async (resolve, reject) => {
    const cacheKey = `spaceType-popular-${limit}`

    getFromCacheOrQuery(cacheKey, () => {
      mongoose
        .model('SpaceType')
        .find()
        .limit(limit)
        .sort('-followersCount -spacesCount -productsCount -updatedAt')
        .exec(async (err, spaceTypes) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaceTypes)) {
            for (let spaceType of spaceTypes) {
              const products = await getProducts(toStringId(spaceType))
              spaceType.set('products', products)
            }

            await saveToCache(cacheKey, toJSON(spaceTypes), toIds(spaceTypes))
            resolve(spaceTypes)
          } else {
            resolve([])
          }
        })
    }, resolve)
  })
}
