import isEmpty from 'lodash/isEmpty'

import toStringId from '../utils/toStringId'
import getProducts from './getProducts'
import generateImage from '../../utils/image/generateImage'
import getProductImages from '../utils/getProductImages'
import { invalidateFromCache } from '../cache'

export default (spaceType) => (
  new Promise(async (resolve, reject) => {
    const products = await getProducts(toStringId(spaceType), 4)

    if (!isEmpty(products)) {
      const image = await generateImage(
        'spaceTypes', getProductImages(products)
      )

      spaceType.set({ image })
      spaceType.save((err) => {
        if (err) {
          return reject(err)
        }

        invalidateFromCache(toStringId(spaceType))
        resolve()
      })
    } else {
      resolve()
    }
  })
)
