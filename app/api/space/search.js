import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import { parseError } from '../utils'

export default (params = {}) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .find()
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 40)))
      .sort('-createdAt')
      .populate({
        path: 'products',
        options: { populate: 'colors categories' }
      })
      .populate('createdBy')
      .populate('spaceType')
      .populate('originalSpace')
      .exec((err, spaces) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(isEmpty(spaces) ? [] : spaces)
      })
  })
}
