import isEmpty from 'lodash/isEmpty'

import toStringId from '../utils/toStringId'
import getProducts from './getProducts'
import generateImage from '../../utils/image/generateImage'
import getProductImages from '../utils/getProductImages'
import { invalidateFromCache } from '../cache'

export default (category) => {
  return new Promise(async (resolve, reject) => {
    const products = await getProducts(toStringId(category), 4)

    if (!isEmpty(products)) {
      const image = await generateImage(
        'categories', getProductImages(products)
      )

      category.set({ image })
      category.save((err) => {
        if (err) {
          return reject(err)
        }

        invalidateFromCache(toStringId(category))
        resolve()
      })
    } else {
      resolve()
    }
  })
}
