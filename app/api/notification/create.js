import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default props => (
  new Promise(async (resolve, reject) => {
    const Notification = mongoose.model('Notification')
    const notification = new Notification(props)

    notification.save(async (err, savedNotification) => {
      if (err) {
        return reject(parseError(err))
      }

      resolve(savedNotification)
    })
  })
)
