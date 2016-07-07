import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (parentType, parent, createdBy) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Like')
      .findOneAndRemove({
        parent, createdBy, parentType
      }, (err, like) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(like)
      })
  })
}
