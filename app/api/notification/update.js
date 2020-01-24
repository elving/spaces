import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (_id, props) => (
  new Promise((resolve, reject) => {
    const options = {
      new: true,
      runValidators: true
    }

    mongoose
      .model('Notification')
      .findOneAndUpdate({ _id }, props, options, async (err, notification) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(notification)
      })
  })
)
