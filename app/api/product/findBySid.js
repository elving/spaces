import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

import getLastLikes from './getLastLikes'
import getLastComments from './getLastComments'

export default (sid, returnDocument = false) => (
  new Promise((resolve, reject) => {
    const key = `product-${sid}`

    const query = () => {
      mongoose
        .model('Product')
        .findOne({ sid })
        .populate('brand')
        .populate('colors')
        .populate('categories')
        .populate('spaceTypes')
        .exec(async (err, product = {}) => {
          if (err) {
            return reject(parseError(err))
          }

          try {
            const lastLikes = await getLastLikes(toStringId(product))
            const lastComments = await getLastComments(toStringId(product))

            product.set({ lastLikes, lastComments })

            if (!isEmpty(product)) {
              await saveToCache(key, toJSON(product), [
                toIds(product),
                toIds(lastLikes),
                toIds(lastComments),
                toIdsFromPath(product, 'brand'),
                toIdsFromPath(product, 'colors'),
                toIdsFromPath(product, 'categories'),
                toIdsFromPath(product, 'spaceTypes')
              ])
            }

            resolve(product)
          } catch (metadataErr) {
            return reject(metadataErr)
          }
        })
    }

    if (returnDocument) {
      query()
    } else {
      getFromCacheOrQuery(key, query, resolve)
    }
  })
)
