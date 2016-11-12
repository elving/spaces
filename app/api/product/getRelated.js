import get from 'lodash/get'
import set from 'lodash/set'
import size from 'lodash/size'
import slice from 'lodash/slice'
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
      const searchParams = { limit: 9 }

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
        const relatedProducts = size(products) > 8
          ? slice(products, 0, 8)
          : products

        if (!isEmpty(relatedProducts)) {
          await saveToCache(cacheKey, toJSON(relatedProducts), [
            id,
            toIds(relatedProducts),
            toIdsFromPath(relatedProducts, 'brand'),
            toIdsFromPath(relatedProducts, 'colors'),
            toIdsFromPath(relatedProducts, 'categories'),
            toIdsFromPath(relatedProducts, 'spaceTypes')
          ])

          resolve(relatedProducts)
        } else {
          resolve([])
        }
      } catch (err) {
        reject(err)
      }
    }, resolve)
  })
)
