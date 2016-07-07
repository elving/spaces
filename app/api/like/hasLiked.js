import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (parentType, parent, createdBy) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Like')
      .findOne({ parent, createdBy, parentType })
      .exec(async (err, like) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(!isEmpty(like))
      })
  })
}
