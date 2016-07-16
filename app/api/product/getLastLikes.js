import mongoose from 'mongoose'

import parseError from '../utils/parseError'

const getCount = (parent) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Like')
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
      .model('Like')
      .where({ parent })
      .limit(5)
      .populate('createdBy')
      .sort('-createdAt')
      .exec(async (err, likes = []) => {
        if (err) {
          return reject(parseError(err))
        }

        try {
          const count = await getCount(parent)
          resolve({ count, likes })
        } catch (countErr) {
          reject(countErr)
        }
      })
  })
)
