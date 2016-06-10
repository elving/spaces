import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import { toJSON } from '../api/utils'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/spaceType/getAll'
import create from '../api/spaceType/create'
import update from '../api/spaceType/update'
import destroy from '../api/spaceType/destroy'
import findBySid from '../api/spaceType/findBySid'

export const renderAllSpaceTypes = async (req, res, next) => {
  try {
    const spaceTypes = await getAll()

    res.locals.metadata = {
      title: 'All SapceTypes | Spaces',
      bodyId: 'all-spaceTypes',
      bodyClass: 'page page-all-spaceTypes page-admin-table'
    }

    res.locals.props = {
      spaceTypes: toJSON(spaceTypes)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAddSpaceType = (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  res.locals.metadata = {
    title: 'Add SpaceType | Spaces',
    bodyId: 'add-spaceType',
    bodyClass: 'page page-add-spaceType page-crud-spaceType'
  }

  next()
}

export const addSpaceType = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    const spaceType = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(spaceType)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateSpaceType = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  if (isEqual(sid, 'add') || isEmpty(sid)) {
    next()
  }

  try {
    const spaceType = await findBySid(sid)

    res.locals.metadata = {
      title: 'Update SpaceType | Spaces',
      bodyId: 'update-spaceType',
      bodyClass: 'page page-update-spaceType page-crud-spaceType'
    }

    res.locals.props = {
      spaceType: toJSON(spaceType)
    }

    if (isEmpty(spaceType)) {
      res.redirect('/404/')
    }

    next()
  } catch (err) {
    res.redirect('/500/')
  }
}

export const updateSpaceType = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    const spaceType = await update(sid, req.body)
    res.status(200).json(spaceType)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroySpaceType = async (req, res) => {
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
