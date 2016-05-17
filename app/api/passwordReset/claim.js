import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import { parseError } from '../utils'

export default (code) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('PasswordRequest')
      .findOne({ code })
      .exec((err, request) => {
        if (err) {
          return reject(parseError(err))
        }

        if (isEmpty(request) || request.get('claimed')) {
          return reject('Invalid password reset code.')
        }

        request.set('claimed', true)
        request.save((err) => {
          if (err) {
            return reject(parseError(err))
          }

          resolve(request)
        })
      })
  })
}
