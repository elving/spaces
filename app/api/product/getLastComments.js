import mongoose from 'mongoose'

import parseError from '../utils/parseError'

const getCount = (parent) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Comment')
      .where({ parent })
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)

export default (parent) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Comment')
      .where({ parent })
      .limit(5)
      .populate('createdBy')
      .sort('-createdAt')
      .exec(async (err, comments = []) => {
        if (err) {
          return reject(parseError(err))
        }

        try {
          const count = await getCount(parent)
          resolve({ count, comments })
        } catch (countErr) {
          reject(countErr)
        }
      })
  })
)
