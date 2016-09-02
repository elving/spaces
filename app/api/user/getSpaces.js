import get from 'lodash/get'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('User')
      .findOne({ _id })
      .populate({
        path: 'spaces',
        options: {
          populate: 'spaceType'
        }
      })
      .exec((err, user) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(get(user, 'spaces', []))
      }
    )
  })
)
