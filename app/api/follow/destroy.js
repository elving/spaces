import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (parentType, parent, createdBy) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Follow')
      .findOneAndRemove({
        parent, createdBy, parentType
      }, (err, follow) => {
        if (err) {
          return reject(parseError(err))
        }

        return resolve(follow)
      })
  })
)
