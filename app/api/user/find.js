import mongoose from 'mongoose'
import { parseError } from '../utils'

export default (emailOrUsername) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('User')
      .findOne()
      .or([{ email: emailOrUsername }, { username: emailOrUsername }])
      .populate('likes')
      .populate('spaces')
      .populate('products')
      .populate('comments')
      .exec((err, user) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(user)
      }
    )
  })
}
