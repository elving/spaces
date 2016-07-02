import get from 'lodash/get'
import mongoose from 'mongoose'

import { parseError } from '../utils'

export default (_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('User')
      .findOne({ _id })
      .populate('spaces')
      .exec((err, user) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(get(user, 'spaces', []))
      }
    )
  })
}
