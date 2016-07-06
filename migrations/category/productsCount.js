import get from 'lodash/get'
import mongoose from 'mongoose'

import getAll from '../../app/api/category/getAll'
import update from '../../app/api/category/update'

const getCount = (category) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .where({ categories: { $in: [category] }})
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
)

export default () => {
  console.log('category/productsCount => Start')

  return new Promise(async (resolve, reject) => {
    try {
      const categories = await getAll()

      for (let category of categories) {
        const id = get(category, 'id')
        const productsCount = await getCount(id)
        await update(id, { productsCount })
      }

      console.log('category/productsCount => Done')
    } catch (err) {
      reject(err)
    }
  })
}
