import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import { parseError } from '../utils'

export default (params = {}) => {
  return new Promise(async (resolve, reject) => {
    mongoose
      .model('User')
      .find()
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 30)))
      .sort('-createdAt')
      .exec(async (err, users) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(isEmpty(users) ? [] : users)
      })
  })
}
