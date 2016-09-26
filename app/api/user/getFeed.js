import get from 'lodash/get'
import size from 'lodash/size'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import concat from 'lodash/concat'
import assign from 'lodash/assign'
import reduce from 'lodash/reduce'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'

import toStringId from '../utils/toStringId'
import searchSpaces from '../space/search'
import searchProducts from '../product/search'
import getFollowsByUser from '../follow/getByUser'

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

        const param = compact(concat([], params[key], parent))

        return !isEmpty(param) ? assign({}, params, {
          [key]: param
        }) : params
      }, {})


      const spaces = await searchSpaces(searchParams, 'or')
      const products = await searchProducts(searchParams, 'or')

      const filteredSpaces = filter(get(spaces, 'results', []), space =>
        toStringId(get(space, 'createdBy')) !== toStringId(user)
      )

      const filteredProducts = filter(get(products, 'results', []), product =>
        toStringId(get(product, 'createdBy')) !== toStringId(user)
      )

      resolve({
        count: size(filteredSpaces) + size(filteredProducts),
        results: sortBy(concat(
          [], filteredSpaces, filteredProducts
        ), 'createdAt', date => new Date(date))
      })
    } catch (err) {
      reject(err)
    }
  })
)
