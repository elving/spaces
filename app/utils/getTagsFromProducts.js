import get from 'lodash/get'
import concat from 'lodash/concat'
import uniqBy from 'lodash/uniqBy'
import forEach from 'lodash/forEach'

export default (products) => {
  let colors = []
  let categories = []

  forEach(products, (product) => {
    colors = concat(colors, get(product, 'colors', []))
    categories = concat(categories, get(product, 'categories', []))
  })

  colors = uniqBy(colors, 'id')
  categories = uniqBy(categories, 'id')

  return {
    colors,
    categories
  }
}
