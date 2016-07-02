import get from 'lodash/get'
import size from 'lodash/size'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import { parseError, makeSearchQuery } from '../utils'

const getCount = (params) => {
  return new Promise((resolve, reject) => {
    mongoose
      .model('User')
      .where(params)
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
}

export default (params = {}) => {
  return new Promise((resolve, reject) => {
    const searchParams = makeSearchQuery(params)

    mongoose
      .model('User')
      .where(searchParams)
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 30)))
      .sort('-createdAt')
      .exec(async (err, users) => {
        if (err) {
          return reject(parseError(err))
        }

        const count = await getCount(searchParams)

        resolve({
          count: count || size(users),
          results: users
        })
      })
  })
}
