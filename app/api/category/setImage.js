import isEmpty from 'lodash/isEmpty'

import toStringId from '../utils/toStringId'
import getProducts from './getProducts'
import generateImage from '../../utils/image/generateImage'
import getProductImages from '../utils/getProductImages'
import { removeFromCache, invalidateFromCache } from '../cache'

export default (category) => (
  new Promise(async (resolve, reject) => {
    const products = await getProducts(toStringId(category), 4)

    if (!isEmpty(products)) {
      const image = await generateImage(
        'categories', getProductImages(products)
      )

      category.set({ image })
      category.save(async (err) => {
        if (err) {
          return reject(err)
        }

        await removeFromCache('category-all')
        await removeFromCache('category-popular-8')
        await invalidateFromCache(toStringId(category))

        resolve()
      })
    } else {
      resolve()
    }
  })
)
