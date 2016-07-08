import mongoose from 'mongoose'

import getAll from '../../app/api/spaceType/getAll'
import update from '../../app/api/spaceType/update'
import toStringId from '../../app/api/utils/toStringId'

const getProductCount = (spaceType) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .where({ spaceTypes: { $in: [spaceType] }})
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
)

export default () => {
  return new Promise(async (resolve, reject) => {
    console.log('spaceType/setProductsCount => Start')
    try {
      const spaceTypes = await getAll()

      for (let spaceType of spaceTypes) {
        const id = toStringId(spaceType)
        const productsCount = await getProductCount(id)
        await update(id, { productsCount })
      }

      console.log('spaceType/setProductsCount => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
