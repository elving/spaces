import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default () => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Guide')
      .find()
      .sort('-createdAt')
      .populate('createdBy')
      .exec(async (err, guides = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(guides)
      })
  })
)
