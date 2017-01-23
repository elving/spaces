import map from 'lodash/map'
import slice from 'lodash/slice'
import filter from 'lodash/filter'
import concat from 'lodash/concat'
import includes from 'lodash/includes'

import toJSON from '../api/utils/toJSON'
import metadata from '../constants/metadata'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import toStringId from '../api/utils/toStringId'
import setMetadata from '../utils/middlewares/setMetadata'

import getUsers from '../api/user/getPopular'
import getRooms from '../api/spaceType/getPopular'
import getSpaces from '../api/space/getPopular'
import getProducts from '../api/product/getPopular'
import getCategories from '../api/category/getPopular'
import getRelatedRooms from '../api/spaceType/getRelated'
import getRelatedProducts from '../api/product/getRelated'
import getRelatedCategories from '../api/category/getRelated'

export default async (req, res, next) => {
  try {
    let relatedRooms = []
    let relatedProducts = []
    let relatedCategories = []

    const description = (
      `See what's trending and popular on Spaces — ${metadata.shortDescription}`
    )

    const users = await getUsers(6)
    const rooms = await getRooms(6)
    const spaces = await getSpaces(8)
    const products = await getProducts(8)
    const categories = await getCategories(6)
    const trendingProducts = await getProducts(8, true)

    const roomsToJSON = toJSON(rooms)
    const productsToJSON = toJSON(products)
    const categoriesToJSON = toJSON(categories)

    const productIds = map(productsToJSON, product => toStringId(product))

    for (const product of slice(productsToJSON, 4, 8)) {
      relatedProducts = concat(relatedProducts, {
        main: product,
        related: await getRelatedProducts(product)
      })
    }

    for (const room of slice(roomsToJSON, 3, 6)) {
      relatedRooms = concat(relatedRooms, {
        main: room,
        related: await getRelatedRooms(room)
      })
    }

    for (const category of slice(categoriesToJSON, 3, 6)) {
      relatedCategories = concat(relatedCategories, {
        main: category,
        related: await getRelatedCategories(category)
      })
    }

    setOgTags(req, res, {
      ogTitle: 'Trending on Spaces',
      ogDescription: description
    })

    setMetadata(res, {
      title: 'Popular | Spaces',
      bodyId: 'home',
      bodyClass: 'page page-home',
      description
    })

    setProps(res, {
      users: toJSON(users),
      rooms: slice(roomsToJSON, 0, 3),
      spaces: toJSON(spaces),
      products: slice(productsToJSON, 0, 4),
      categories: slice(categoriesToJSON, 0, 3),
      relatedRooms,
      relatedProducts,
      trendingProducts: filter(toJSON(trendingProducts), product =>
        !includes(productIds, toStringId(product))
      ),
      relatedCategories
    })

    next()
  } catch (err) {
    next(err)
  }
}
