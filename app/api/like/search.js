import get from 'lodash/get'
import size from 'lodash/size'
import mongoose from 'mongoose'
import parseInt from 'lodash/parseInt'
import upperFirst from 'lodash/upperFirst'

import parseError from '../utils/parseError'
import makeSearchQuery from '../utils/makeSearchQuery'
import makeConditionalSearchQuery from '../utils/makeConditionalSearchQuery'

const getCount = (params) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Like')
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
      query = mongoose.model('Like').find({
        $and: makeConditionalSearchQuery(searchParams)
      })
    } else if (operation === 'or') {
      query = mongoose.model('Like').find({
        $or: makeConditionalSearchQuery(searchParams)
      })
    } else {
      query = mongoose.model('Like').where(searchParams)
    }

    query
      .skip(parseInt(get(params, 'skip', 0)))
      .limit(parseInt(get(params, 'limit', 50)))
      .sort('-createdAt')
      .populate('createdBy')
      .exec(async (err, likes) => {
        if (err) {
          return reject(parseError(err))
        }

        try {
          for (const like of likes) {
            let populate = ''
            const parentType = get(like, 'parentType')

            if (parentType === 'space') {
              populate = 'colors products createdBy categories spaceType'
            } else if (parentType === 'product') {
              populate = 'brand colors createdBy categories spaceTypes'
            } else if (parentType === 'guide') {
              populate = 'createdBy'
            }

            await like.populate({
              path: 'parent',
              model: upperFirst(parentType),
              options: { populate }
            }).execPopulate()

            if (parentType === 'space') {
              await like.populate({
                path: 'originalSpace',
                options: {
                  populate: 'createdBy'
                }
              }).execPopulate()
            }
          }

          const count = await getCount(searchParams)

          resolve({
            count: count || size(likes),
            results: likes
          })
        } catch (populateErr) {
          reject(parseError(populateErr))
        }
      })
  })
)
