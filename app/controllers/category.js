import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import { toJSON } from '../api/utils'
import isAuthenticatedUser from '../utils/isAuthenticatedUser'

import getAll from '../api/category/getAll'
import create from '../api/category/create'
import update from '../api/category/update'
import destroy from '../api/category/destroy'
import findBySid from '../api/category/findBySid'

export const renderAllCategories = async (req, res, next) => {
  try {
    const categories = await getAll()

    res.locals.metadata = {
      title: 'All Categories | Spaces',
      bodyId: 'all-categories',
      bodyClass: 'page page-all-categories page-admin-table'
    }

    res.locals.props = {
      categories: toJSON(categories)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAddCategory = (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  res.locals.metadata = {
    title: 'Add Category | Spaces',
    bodyId: 'add-category',
    bodyClass: 'page page-add-category page-crud-category'
  }

  next()
}

export const addCategory = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
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

    res.locals.metadata = {
      title: 'Update Category | Spaces',
      bodyId: 'update-category',
      bodyClass: 'page page-update-category page-crud-category'
    }

    res.locals.props = {
      category: toJSON(category)
    }

    if (isEmpty(category)) {
      res.redirect('/404/')
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const updateCategory = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    const category = await update(sid, req.body)
    res.status(200).json(category)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroyCategory = async (req, res) => {
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
