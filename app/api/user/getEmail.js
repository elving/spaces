import get from 'lodash/get'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (username) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('User')
      .findOne({ username })
      .exec(async (err, user) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(get(user, 'email', ''))
      })
  })
)
