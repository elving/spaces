import get from 'lodash/get'
import size from 'lodash/size'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import makeSearchQuery from '../utils/makeSearchQuery'
import makeConditionalSearchQuery from '../utils/makeConditionalSearchQuery'

const getCount = (params) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Follow')
      .where(params)
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
)

export default (params = {}, operation = 'where') => (
  new Promise((resolve, reject) => {
    let query
    const searchParams = makeSearchQuery(params)

    if (operation === 'and') {
      query = mongoose.model('Follow').find({
        $and: makeConditionalSearchQuery(searchParams)
      })
    } else if (operation === 'or') {
      query = mongoose.model('Follow').find({
        $or: makeConditionalSearchQuery(searchParams)
      })
    } else {
      query = mongoose.model('Follow').where(searchParams)
    }

    query
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 40)))
      .sort(get(params, 'sort', '-createdAt'))
      .populate('parent')
      .populate('createdBy')
      .exec(async (err, follows = []) => {
        if (err) {
          return reject(parseError(err))
        }

        const count = await getCount(searchParams)

        resolve({
          count: count || size(follows),
          results: follows
        })
      })
  })
)
