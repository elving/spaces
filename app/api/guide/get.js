import mongoose from 'mongoose'

import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'

export default sid => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Guide')
      .findOne({ sid })
      .exec(async (err, guide = {}) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(toJSON(guide))
      })
  })
)
