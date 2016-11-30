import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default recipient => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Notification')
      .where({
        unread: { $eq: true },
        recipient
      })
      .setOptions({
        multi: true
      })
      .update({
        unread: false
      }, (err, notifications = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(notifications)
      })
  })
)
