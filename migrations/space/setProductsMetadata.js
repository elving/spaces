import get from 'lodash/get'
import mongoose from 'mongoose'

import log from '../../app/utils/log'
import geTags from '../../app/utils/product/getTags'
import getAll from '../../app/api/space/getAll'
import update from '../../app/api/space/update'
import toStringId from '../../app/api/utils/toStringId'
import toObjectId from '../../app/api/utils/toObjectId'

const getProductsMetadata = (ids) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .where({ _id: { $in: ids } })
      .exec((err, products = []) => {
        if (err) {
          return reject(err)
        }

        resolve(geTags(products))
      })
  })
)

export default () => (
  new Promise(async (resolve, reject) => {
    log('space/setProductsMetadata => Start')

    try {
      const spaces = await getAll()

      for (const space of spaces) {
        const products = toObjectId(get(space, 'products', []))
        const metadata = await getProductsMetadata(products)
        await update(toStringId(space), metadata)
      }

      log('space/setProductsMetadata => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
)
