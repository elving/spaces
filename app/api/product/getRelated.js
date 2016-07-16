import get from 'lodash/get'
import set from 'lodash/set'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import search from './search'
import toStringId from '../utils/toStringId'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (product) => (
  new Promise(async (resolve, reject) => {
    const id = toStringId(product)
    const cacheKey = `product-related-${id}`

    getFromCacheOrQuery(cacheKey, async () => {
      const categories = get(product, 'categories', [])
      const spaceTypes = get(product, 'spaceTypes', [])
      const searchParams = { limit: 8 }

      if (!isEmpty(categories)) {
        set(searchParams, 'categories', toIds(categories))
      }

      if (!isEmpty(spaceTypes)) {
        set(searchParams, 'spaceTypes', toIds(spaceTypes))
      }

      try {
        const results = await search(searchParams, 'and')
        const products = filter(get(results, 'results', []), result => (
          toStringId(result) !== id
        ))

        if (!isEmpty(products)) {
          await saveToCache(cacheKey, toJSON(products), [
            id,
            toIds(products),
            toIdsFromPath(products, 'brand'),
            toIdsFromPath(products, 'colors'),
            toIdsFromPath(products, 'categories'),
            toIdsFromPath(products, 'spaceTypes')
          ])

          resolve(products)
        } else {
          resolve([])
        }
      } catch (err) {
        reject(err)
      }
    }, resolve)
  })
)
