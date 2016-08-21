import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import setMetadata from '../utils/middlewares/setMetadata'

import { default as getUsers } from '../api/user/getPopular'
import { default as getRooms } from '../api/spaceType/getPopular'
import { default as getSpaces } from '../api/space/getPopular'
import { default as getProducts } from '../api/product/getPopular'
import { default as getCategories } from '../api/category/getPopular'

export const renderHome = async (req, res, next) => {
  try {
    const users = await getUsers(6)
    const rooms = await getRooms(6)
    const spaces = await getSpaces(8)
    const products = await getProducts(8)
    const categories = await getCategories(6)

    setOgTags(req, res, {
      ogTitle: 'What\'s trending on Spaces'
    })

    setMetadata(res, {
      title: 'Home | Spaces',
      bodyId: 'home',
      bodyClass: 'page page-home'
    })

    setProps(res, {
      users: toJSON(users),
      rooms: toJSON(rooms),
      spaces: toJSON(spaces),
      products: toJSON(products),
      categories: toJSON(categories)
    })

    next()
  } catch (err) {
    next(err)
  }
}
