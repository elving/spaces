import mongoose from 'mongoose'

import log from '../../app/utils/log'
import getAll from '../../app/api/category/getAll'
import update from '../../app/api/category/update'
import toStringId from '../../app/api/utils/toStringId'

const getSpaceCount = category => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .where({ categories: { $in: [category] } })
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
)

export default () => (
  new Promise(async (resolve, reject) => {
    log('category/setSpacesCount => Start')

    try {
      const categories = await getAll()

      for (const category of categories) {
        const id = toStringId(category)
        const spacesCount = await getSpaceCount(id)
        await update(id, { spacesCount })
      }

      log('category/setSpacesCount => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
)
