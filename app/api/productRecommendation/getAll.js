import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default (params = {}) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('ProductRecommendation')
      .where(params)
      .sort('createdAt')
      .populate('createdBy')
      .exec((err, recommendations) => {
        if (err) {
          return reject(parseError(err))
        }

        if (!isEmpty(recommendations)) {
          resolve(recommendations)
        } else {
          resolve([])
        }
      })
  })
)
