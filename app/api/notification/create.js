import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import renderText from './renderText'
import renderHTML from './renderHTML'
import sendNotificationEmail from '../../email/sendNotificationEmail'

export default props => (
  new Promise(async (resolve, reject) => {
    const Notification = mongoose.model('Notification')
    const notification = new Notification(props)

    notification.save(async (err, savedNotification) => {
      if (err) {
        return reject(parseError(err))
      }

      savedNotification
        .populate({
          path: 'context',
          select: 'sid name'
        })
        .populate({
          path: 'recipient',
          select: 'email'
        })
        .populate({
          path: 'createdBy',
          select: 'avatar username'
        }, (populateErr, populatedNotification) => {
          if (populateErr) {
            return reject(parseError(populateErr))
          }

          sendNotificationEmail(populatedNotification)
          resolve(savedNotification)
        })
    })
  })
)
