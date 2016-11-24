import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import isAdmin from '../utils/user/isAdmin'
import isOwner from '../utils/user/isOwner'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import create from '../api/product/create'
import update from '../api/product/update'
import destroy from '../api/product/destroy'
import findBySid from '../api/product/findBySid'
import fromBrand from '../api/product/fromBrand'
import getRelated from '../api/product/getRelated'
import getRecommended from '../api/product/getRecommended'
import getRelatedSpaces from '../api/product/getRelatedSpaces'
import fetchProductData from '../api/product/fetchProductData'

import toJSON from '../api/utils/toJSON'
import toStringId from '../api/utils/toStringId'
import getAllBrands from '../api/brand/getAll'
import getAllColors from '../api/color/getAll'
import getAllCategories from '../api/category/getAll'
import getAllSpaceTypes from '../api/spaceType/getAll'

export const renderIndex = async (req, res, next) => {
  try {
    setOgTags(req, res, {
      ogTitle: (
        'Shop and design spaces with the most beautiful ' +
        'products on the web.'
      )
    })

    setMetadata(res, {
      title: 'Discover Products | Spaces',
      bodyId: 'all-products',
      bodyClass: 'page page-all-products'
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderDetail = async (req, res, next) => {
  if (get(req, 'params.name') === 'update') {
    return next()
  }

  const sid = get(req, 'params.sid')

  try {
    const product = await findBySid(sid)

    if (isEmpty(product) || get(product, 'isPendingApproval') === true) {
      return res.redirect('/404/')
    }

    const moreFromBrand = await fromBrand(product)
    const relatedSpaces = await getRelatedSpaces(toStringId(product))
    const relatedProducts = await getRelated(product)

    const url = get(product, 'url')
    const name = get(product, 'name')
    const brand = get(product, 'brand.name')
    const price = get(product, 'price')
    const image = get(product, 'image')
    const description = get(product, 'description')

    setOgTags(req, res, {
      ogTitle: `${name} by ${brand} — $${price} on Spaces.`,
      ogImage: image,
      ogDescription: `${description}. ${url}`
    })

    setMetadata(res, {
      title: `${get(product, 'name', '')} | Spaces`,
      bodyId: 'page-product-detail',
      bodyClass: 'page'
    })

    setProps(res, {
      product: toJSON(product),
      moreFromBrand: toJSON(moreFromBrand),
      relatedSpaces: toJSON(relatedSpaces),
      relatedProducts: toJSON(relatedProducts)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAdminProducts = async (req, res, next) => {
  try {
    setMetadata(res, {
      title: 'All Products | Spaces',
      bodyId: 'all-products',
      bodyClass: 'page page-all-products page-admin-table'
    })

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
}

export const renderAddProduct = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  try {
    const action = (
      !get(req, 'user.isCurator', false) ||
      !get(req, 'user.isAdmin', false)
    ) ? 'Recommend' : 'Add'

    const brands = await getAllBrands()
    const colors = await getAllColors()
    const categories = await getAllCategories()
    const spaceTypes = await getAllSpaceTypes()

    setMetadata(res, {
      title: `${action} Product | Spaces`,
      bodyId: 'add-product',
      bodyClass: 'page page-add-product'
    })

    setProps(res, {
      brands: toJSON(brands),
      colors: toJSON(colors),
      categories: toJSON(categories),
      spaceTypes: toJSON(spaceTypes)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const addProduct = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const product = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id'),
        isPendingApproval: (
          !get(req, 'user.isCurator', false) ||
          !get(req, 'user.isAdmin', false)
        )
      })
    )

    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateProduct = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
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

    setMetadata(res, {
      title: 'Update Product | Spaces',
      bodyId: 'update-product',
      bodyClass: 'page page-update-product page-crud-product'
    })

    setProps(res, {
      brands: toJSON(brands),
      colors: toJSON(colors),
      product: toJSON(product),
      categories: toJSON(categories),
      spaceTypes: toJSON(spaceTypes)
    })

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
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
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
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    await destroy(id)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderRecommended = async (req, res, next) => {
  try {
    const products = await getRecommended()

    setMetadata(res, {
      title: 'Recommended Products | Spaces',
      bodyId: 'recommended-products',
      bodyClass: 'page page-recommended-products page-admin-table'
    })

    setProps(res, {
      products: toJSON(products)
    })

    next()
  } catch (err) {
    next(err)
  }
}
