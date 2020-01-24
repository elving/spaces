import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

const find = _id => (
  new Promise((resolve, reject) => {
    mongoose
      .model('User')
      .findOne({ _id })
      .exec((err, user) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(user)
      })
  })
)

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    try {
      const user = await find(_id)

      if (isEmpty(user)) {
        return reject({
          generic: (
            'There was an error while trying to change your password. ' +
            'Please try again later.'
          )
        })
      }

      if (!user.authenticate(props.password)) {
        return reject({
          password: (
            'The current password you entered is incorrect. ' +
            'Please enter a different password.'
          )
        })
      }

      user.set('password', props.newPassword)

      user.save((err, updatedUser) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(updatedUser)
      })
    } catch (err) {
      reject(err)
    }
  })
)
