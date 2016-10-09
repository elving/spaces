import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id) => (
  new Promise(async (resolve, reject) => {
    mongoose
      .model('SpaceType')
      .findOneAndRemove({ _id }, async (err) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve()
      })
  })
)
