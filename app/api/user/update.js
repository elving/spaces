import mongoose from 'mongoose'

import sanitize from './sanitize'
import { parseError } from '../utils'

export default (_id, props) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('User')
      .findOneAndUpdate({ _id }, sanitize(props), {
        runValidators: true
      }, (err, user) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(user)
      })
  })
}
