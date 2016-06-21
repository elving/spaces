import { toJSON } from '../api/utils'
import { default as getUsers } from '../api/user/getPopular'
import { default as getSpaces } from '../api/space/getPopular'
import { default as getProducts } from '../api/product/getPopular'
import { default as getCategories } from '../api/category/getPopular'

export const renderHome = async (req, res, next) => {
  try {
    const users = await getUsers(6)
    const spaces = await getSpaces(8)
    const products = await getProducts(8)
    const categories = await getCategories(6)

    res.locals.metadata = {
      title: 'Home | Spaces',
      bodyId: 'home',
      bodyClass: 'page page-home'
    }

    res.locals.props = {
      users: toJSON(users),
      spaces: toJSON(spaces),
      products: toJSON(products),
      categories: toJSON(categories)
    }

    next()
  } catch (err) {
    next(err)
  }
}
