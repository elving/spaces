import uuid from 'node-uuid'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (email) => {
  return new Promise((resolve, reject) => {
    const PasswordRequest = mongoose.model('PasswordRequest')
    const request = new PasswordRequest({
      code: uuid.v4(),
      email
    })

    request.save((err, request) => {
      if (err) {
        return reject(parseError(err))
      }

      resolve(request)
    })
  })
}
