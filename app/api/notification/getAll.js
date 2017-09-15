import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default recipient => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Notification')
      .where({ recipient, unread: { $eq: true } })
      .populate('context', 'sid name')
      .populate('createdBy', 'avatar username')
      .sort('createdAt')
      .exec(async (err, notifications = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(notifications)
      })
  })
)
