import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import isAdmin from '../utils/user/isAdmin'
import isOwner from '../utils/user/isOwner'
import userCanAddProducts from '../utils/userCanAddProducts'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import search from '../api/product/search'
import getAll from '../api/product/getAll'
import create from '../api/product/create'
import update from '../api/product/update'
import destroy from '../api/product/destroy'
import findBySid from '../api/product/findBySid'
import fetchProductData from '../api/product/fetchProductData'

import { toJSON } from '../api/utils'
import { default as getAllBrands } from '../api/brand/getAll'
import { default as getAllColors } from '../api/color/getAll'
import { default as getAllCategories } from '../api/category/getAll'
import { default as getAllSpaceTypes } from '../api/spaceType/getAll'

export const renderIndex = async (req, res, next) => {
  try {
    const products = await search()

    res.locals.metadata = {
      title: 'Discover Products | Spaces',
      bodyId: 'all-products',
      bodyClass: 'page page-all-products'
    }

    res.locals.props = {
      products: toJSON(products)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAdminProducts = async (req, res, next) => {
  try {
    const products = await getAll()

    res.locals.metadata = {
      title: 'All Products | Spaces',
      bodyId: 'all-products',
      bodyClass: 'page page-all-products page-admin-table'
    }

    res.locals.props = {
      products: toJSON(products)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const fetchProductInfo = async (req, res) => {
  const url = get(req, 'query.url')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  if (isEmpty(url)) {
    return res.status(500).json({
      err: {
        generic: 'A url is required to get the product\'s information.'
      }
    })
  }

  if (get(req, 'user.isCurator') || get(req, 'user.isAdmin')) {
    try {
      const data = await fetchProductData(url)
      res.status(200).json({ ...data })
    } catch (err) {
      res.status(500).json({
        err: {
          generic: (
            'There was a problem while trying to get ' +
            'this product\'s information'
          )
        }
      })
    }
  } else {
    return res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }
}

export const renderAddProduct = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user) || !userCanAddProducts(req.user)) {
    return res.redirect('/404/')
  }

  try {
    const brands = await getAllBrands()
    const colors = await getAllColors()
    const categories = await getAllCategories()
    const spaceTypes = await getAllSpaceTypes()

    res.locals.metadata = {
      title: 'Add Product | Spaces',
      bodyId: 'add-product',
      bodyClass: 'page page-add-product'
    }

    res.locals.props = {
      brands: toJSON(brands),
      colors: toJSON(colors),
      categories: toJSON(categories),
      spaceTypes: toJSON(spaceTypes)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const addProduct = async (req, res) => {
  if (!isAuthenticatedUser(req.user) || !userCanAddProducts(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    const product = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateProduct = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user) || !userCanAddProducts(req.user)) {
    return res.redirect('/404/')
  }

  if (isEqual(sid, 'add') || isEmpty(sid)) {
    next()
  }

  try {
    const product = await findBySid(sid)

    if (!isAdmin(req.user) && !isOwner(req.user, product)) {
      return res.redirect('/404/')
    }

    const brands = await getAllBrands()
    const colors = await getAllColors()
    const categories = await getAllCategories()
    const spaceTypes = await getAllSpaceTypes()

    res.locals.metadata = {
      title: 'Update Product | Spaces',
      bodyId: 'update-product',
      bodyClass: 'page page-update-product page-crud-product'
    }

    res.locals.props = {
      brands: toJSON(brands),
      colors: toJSON(colors),
      product: toJSON(product),
      categories: toJSON(categories),
      spaceTypes: toJSON(spaceTypes)
    }

    if (isEmpty(product)) {
      res.redirect('/404/')
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const updateProduct = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    const product = await update(
      id, merge(req.body, {
        updatedBy: get(req, 'user.id')
      })
    )
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroyProduct = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    await destroy(sid)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ err })
  }
}
