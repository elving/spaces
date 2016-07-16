import mongoose from 'mongoose'

import getAll from '../../app/api/category/getAll'
import update from '../../app/api/category/update'
import toStringId from '../../app/api/utils/toStringId'

const getProductCount = (category) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .where({ categories: { $in: [category] } })
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
    console.log('category/setProductsCount => Start')
    try {
      const categories = await getAll()

      for (let category of categories) {
        const id = toStringId(category)
        const productsCount = await getProductCount(id)
        await update(id, { productsCount })
      }

      console.log('category/setProductsCount => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
