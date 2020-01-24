import get from 'lodash/get'
import omit from 'lodash/omit'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import parseInt from 'lodash/parseInt'
import startCase from 'lodash/startCase'

import parseError from '../utils/parseError'

const getCount = params => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Notification')
      .where(params)
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
)

export default (params = {}) => (
  new Promise((resolve, reject) => {
    const searchParams = omit(params, ['skip', 'limit'])

    mongoose
      .model('Notification')
      .where(searchParams)
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 10)))
      .sort('-createdAt')
      .populate('createdBy', 'avatar username')
      .exec(async (err, notifications = []) => {
        if (err) {
          return reject(parseError(err))
        }

        try {
          const count = await getCount(searchParams)
          const populatedNotifications = []

          for (const notification of notifications) {
            const populatedNotification = await notification.populate({
              path: 'context',
              model: startCase(get(notification, 'contextType')),
              select: 'sid name image'
            }).execPopulate()

            if (!isEmpty(populatedNotification)) {
              populatedNotifications.push(populatedNotification)
            }
          }

          resolve({
            count: count || size(notifications),
            results: populatedNotifications
          })
        } catch (countErr) {
          reject(parseError(countErr))
        }
      })
  })
)
