import slice from 'lodash/slice'
import concat from 'lodash/concat'

import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
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

    const users = await getUsers(6)
    const rooms = await getRooms(6)
    const spaces = await getSpaces(8)
    const products = await getProducts(8)
    const categories = await getCategories(6)

    const roomsToJSON = toJSON(rooms)
    const productsToJSON = toJSON(products)
    const categoriesToJSON = toJSON(categories)

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
      ogTitle: 'What\'s trending on Spaces'
    })

    setMetadata(res, {
      title: 'Popular | Spaces',
      bodyId: 'home',
      bodyClass: 'page page-home'
    })

    setProps(res, {
      users: toJSON(users),
      rooms: slice(roomsToJSON, 0, 3),
      spaces: toJSON(spaces),
      products: slice(productsToJSON, 0, 4),
      categories: slice(categoriesToJSON, 0, 3),
      relatedRooms,
      relatedProducts,
      relatedCategories
    })

    next()
  } catch (err) {
    next(err)
  }
}
