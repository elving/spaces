import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'

export default (props) => (
  new Promise((resolve, reject) => {
    const User = mongoose.model('User')
    const user = new User(sanitize(props))
    const errors = user.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    user.save((err) => {
      if (err) {
        return reject(parseError(err))
      }

      resolve(user)
    })
  })
)
