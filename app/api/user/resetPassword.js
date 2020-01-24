import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (props) => {
  return new Promise((resolve, reject) => {
    const email = get(props, 'email')
    const password = get(props, 'password')
    const confirmPassword = get(props, 'confirmPassword')

    mongoose
      .model('User')
      .findOne({ email })
      .exec((err, user) => {
        if (err) {
          return reject(parseError(err))
        }

        if (isEmpty(user)) {
          return reject({
            password: (
              'The email associated with this reset password code is not valid'
            )
          })
        }

        if (!isEqual(password, confirmPassword)) {
          return reject({
            password: (
              'The passwords you entered don\'t match. ' +
              'Please make sure the passwords match.'
            )
          })
        }

        user.set('password', password)
        user.save((err, user) => {
          if (err) {
            return reject(parseError(err))
          }

          resolve(user)
        })
      }
    )
  })
}
