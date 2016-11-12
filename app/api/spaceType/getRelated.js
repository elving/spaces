import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import search from '../product/search'
import toStringId from '../utils/toStringId'
import toIdsFromPath from '../utils/toIdsFromPath'
import { saveToCache } from '../cache'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default room => (
  new Promise(async (resolve, reject) => {
    const id = toStringId(room)
    const cacheKey = `room-related-${id}`

    getFromCacheOrQuery(cacheKey, async () => {
      const searchParams = {
        sort: '-followersCount -spacesCount -productsCount',
        limit: 4,
        spaceTypes: id
      }

      try {
        const results = await search(searchParams, 'and')
        const products = get(results, 'results', [])

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
