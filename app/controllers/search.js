import get from 'lodash/get'

import { toJSON } from '../api/utils'
import { default as getAllBrands } from '../api/brand/getAll'
import { default as getAllColors } from '../api/color/getAll'
import { default as getAllCategories } from '../api/category/getAll'
import { default as getAllSpaceTypes } from '../api/spaceType/getAll'
import { default as searchAllProducts } from '../api/product/search'

export const renderProductsSearch = async (req, res, next) => {
  res.locals.metadata = {
    title: 'Product Search | Spaces',
    bodyId: 'search-products',
    bodyClass: 'page page-search-products page-search'
  }

  try {
    const brands = await getAllBrands()
    const colors = await getAllColors()
    const categories = await getAllCategories()
    const spaceTypes = await getAllSpaceTypes()

    res.locals.props = {
      brands: toJSON(brands),
      colors: toJSON(colors),
      categories: toJSON(categories),
      spaceTypes: toJSON(spaceTypes)
    }
  } catch (err) {
    next(err)
  }

  next()
}

export const searchProducts = async (req, res) => {
  try {
    const results = await searchAllProducts(
      get(req, 'query', {})
    )

    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}
