import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/brand/getAll'
import create from '../api/brand/create'
import update from '../api/brand/update'
import destroy from '../api/brand/destroy'
import findBySid from '../api/brand/findBySid'

export const renderAllBrands = async (req, res, next) => {
  try {
    const brands = await getAll()

    setMetadata(res, {
      title: 'All Brands | Spaces',
      bodyId: 'all-brands',
      bodyClass: 'page page-all-brands page-admin-table'
    })

    setProps(res, {
      brands: toJSON(brands)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAddBrand = (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  setMetadata({
    title: 'Add Brand | Spaces',
    bodyId: 'add-brand',
    bodyClass: 'page page-add-brand page-crud-brand'
  })

  next()
}

export const addBrand = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const brand = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(brand)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateBrand = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  if (isEqual(sid, 'add') || isEmpty(sid)) {
    next()
  }

  try {
    const brand = await findBySid(sid)

    setMetadata(res, {
      title: 'Update Brand | Spaces',
      bodyId: 'update-brand',
      bodyClass: 'page page-update-brand page-crud-brand'
    })

    setProps(res, {
      brand: toJSON(brand)
    })

    if (isEmpty(brand)) {
      res.redirect('/404/')
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const updateBrand = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const brand = await update(sid, req.body)
    res.status(200).json(brand)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroyBrand = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    await destroy(sid)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ err })
  }
}
