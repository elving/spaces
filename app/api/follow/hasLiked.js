import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (parentType, parent, createdBy) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Follow')
      .findOne({ parent, createdBy, parentType })
      .exec(async (err, follow) => {
        if (err) {
          return reject(parseError(err))
        }

        return resolve(!isEmpty(follow))
      })
  })
)
