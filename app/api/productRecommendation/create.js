import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'

export default props => (
  new Promise(async (resolve, reject) => {
    const ProductRecommendation = mongoose.model('ProductRecommendation')
    const recommendation = new ProductRecommendation(sanitize(props))
    const errors = recommendation.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    recommendation.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      resolve(recommendation)
    })
  })
)
