import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import concat from 'lodash/concat'
import assign from 'lodash/assign'
import reduce from 'lodash/reduce'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'

import { default as searchSpaces } from '../space/search'
import { default as searchProducts } from '../product/search'
import { default as getFollowsByUser } from '../follow/getByUser'

export default (user) => (
  new Promise(async (resolve, reject) => {
    try {
      const follows = await getFollowsByUser(user)

      if (isEmpty(follows)) {
        return resolve({
          count: 0,
          results: []
        })
      }

      const searchParams = reduce(follows, (params, follow) => {
        let key = ''
        const parent = get(follow, 'parent')
        const parentType = get(follow, 'parentType')

        if (parentType === 'user') {
          key = 'createdBy'
        } else if (parentType === 'category') {
          key = 'categories'
        } else if (parentType === 'spaceType') {
          key = 'spaceTypes'
        }

        return assign({}, params, {
          [key]: compact(concat([], params[key], parent))
        })
      }, {})

      const spaces = await searchSpaces(searchParams, 'or')
      const products = await searchProducts(searchParams, 'or')

      resolve({
        count: get(spaces, 'count', 0) + get(products, 'count', 0),
        results: sortBy(concat(
          [], get(spaces, 'results', []), get(products, 'results', [])
        ), 'createdAt', date => new Date(date))
      })
    } catch (err) {
      reject(err)
    }
  })
)
