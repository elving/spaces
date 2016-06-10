import get from 'lodash/get'
import merge from 'lodash/merge'

import isAdmin from '../utils/user/isAdmin'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import create from '../api/space/create'
import update from '../api/space/update'
import findBySid from '../api/space/findBySid'
import getLatest from '../api/space/getLatest'

import { toJSON } from '../api/utils'
import { default as getAllUserData } from '../api/user/getData'

export const renderIndex = async (req, res, next) => {
  try {
    const latest = await getLatest()
    const userData = await getAllUserData(get(req, 'user.id'))

    res.locals.metadata = {
      title: 'Discover Spaces | Spaces',
      bodyId: 'all-spaces',
      bodyClass: 'page page-all-spaces'
    }

    res.locals.props = {
      latest: toJSON(latest),
      userData: toJSON(userData)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const renderDetail = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  try {
    const space = await findBySid(sid)
    const userData = await getAllUserData(get(req, 'user.id'))

    res.locals.metadata = {
      title: `${get(space, 'name', '')} | Spaces`,
      bodyId: 'space-detail',
      bodyClass: 'page page-space-detail'
    }

    res.locals.props = {
      space: toJSON(space),
      userData: toJSON(userData)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const createSpace = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    const space = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(space)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderCreateSpace = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  res.locals.metadata = {
    title: 'Create Space | Spaces',
    bodyId: 'create-space',
    bodyClass: 'page page-create-space'
  }

  next()
}

export const updateSpace = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: { genereic: 'Not authorized' }
    })
  }

  try {
    const space = await update(
      id, merge(req.body, {
        updatedBy: get(req, 'user.id'),
        forcedUpdate: isAdmin(get(req, 'user'))
      })
    )

    res.status(200).json(space)
  } catch (err) {
    res.status(500).json({ err })
  }
}
