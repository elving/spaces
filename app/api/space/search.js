import get from 'lodash/get'
import omit from 'lodash/omit'
import size from 'lodash/size'
import parseInt from 'lodash/parseInt'
import mongoose from 'mongoose'

import parseError from '../utils/parseError'
import makeSearchQuery from '../utils/makeSearchQuery'
import makeConditionalSearchQuery from '../utils/makeConditionalSearchQuery'

const getCount = (params) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
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
    const searchParams = omit(
      makeSearchQuery(params), ['spaceTypes']
    )

    if (operation === 'and') {
      query = mongoose.model('Space').find({
        $and: makeConditionalSearchQuery(searchParams)
      })
    } else if (operation === 'or') {
      query = mongoose.model('Space').find({
        $or: makeConditionalSearchQuery(searchParams)
      })
    } else {
      query = mongoose.model('Space').where(searchParams)
    }

    query
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 40)))
      .sort('-createdAt')
      .populate('colors')
      .populate('products')
      .populate('createdBy')
      .populate('categories')
      .populate('spaceType')
      .populate('originalSpace')
      .exec(async (err, spaces) => {
        if (err) {
          return reject(parseError(err))
        }

        const count = await getCount(searchParams)

        resolve({
          count: count || size(spaces),
          results: spaces
        })
      })
  })
)
