import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import metadata from '../constants/metadata'
import setOgTags from '../utils/middlewares/setOgTags'
import toStringId from '../api/utils/toStringId'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import search from '../api/category/search'
import getAll from '../api/category/getAll'
import create from '../api/category/create'
import update from '../api/category/update'
import destroy from '../api/category/destroy'
import findBySid from '../api/category/findBySid'
import findByName from '../api/category/findByName'
import searchProducts from '../api/product/search'

export const renderIndex = async (req, res, next) => {
  const description = (`
    Shop beautiful and useful products from
    around the web by category — ${metadata.shortDescription}
  `)

  try {
    setOgTags(req, res, {
      ogTitle: description
    })

    setMetadata(res, {
      title: 'Discover Categories | Spaces',
      bodyId: 'all-categories',
      bodyClass: 'page page-all-categories',
      description
    })

    setProps(res, await search({ limit: 1000 }))

    next()
  } catch (err) {
    next(err)
  }
}

export const renderDetail = async (req, res, next) => {
  const slug = get(req, 'params.slug')

  try {
    const category = await findByName(slug)

    if (isEmpty(category)) {
      return res.redirect('/404/')
    }

    const products = await searchProducts({
      categories: toStringId(category)
    })

    const description = (`
      Popular products and
      spaces in ${get(category, 'name')} — ${metadata.shortDescription}
    `)

    setOgTags(req, res, {
      ogTitle: description,
      ogImage: get(category, 'image')
    })

    setMetadata(res, {
      title: `${get(category, 'name')} | Spaces`,
      bodyId: 'page-category-detail',
      bodyClass: 'page page-category-detail',
      description
    })

    setProps(res, {
      category: toJSON(category),
      products: toJSON(products)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAllCategories = async (req, res, next) => {
  try {
    const categories = await getAll()

    setMetadata(res, {
      title: 'All Categories | Spaces',
      bodyId: 'all-categories',
      bodyClass: 'page page-all-categories page-admin-table'
    })

    setProps(res, {
      categories: toJSON(categories)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAddCategory = (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  setMetadata(res, {
    title: 'Add Category | Spaces',
    bodyId: 'add-category',
    bodyClass: 'page page-add-category page-crud-category'
  })

  next()
}

export const addCategory = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: { generic: 'Not authorized' }})
  }

  try {
    const category = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(category)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateCategory = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  if (isEqual(sid, 'add') || isEmpty(sid)) {
    next()
  }

  try {
    const category = await findBySid(sid)

    setMetadata(res, {
      title: 'Update Category | Spaces',
      bodyId: 'update-category',
      bodyClass: 'page page-update-category page-crud-category'
    })

    setProps(res, {
      category: toJSON(category)
    })

    if (isEmpty(category)) {
      res.redirect('/404/')
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const updateCategory = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const category = await update(id, req.body)
    res.status(200).json(category)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroyCategory = async (req, res) => {
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
