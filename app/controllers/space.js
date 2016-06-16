import get from 'lodash/get'
import merge from 'lodash/merge'

import isAdmin from '../utils/user/isAdmin'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import create from '../api/space/create'
import update from '../api/space/update'
import findById from '../api/space/findById'
import findBySid from '../api/space/findBySid'
import getLatest from '../api/space/getLatest'
import updateUser from '../api/user/update'

import { toJSON, toObjectId } from '../api/utils'

export const renderIndex = async (req, res, next) => {
  try {
    const latest = await getLatest()

    res.locals.metadata = {
      title: 'Discover Spaces | Spaces',
      bodyId: 'all-spaces',
      bodyClass: 'page page-all-spaces'
    }

    res.locals.props = {
      latest: toJSON(latest)
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

    res.locals.metadata = {
      title: `${get(space, 'name', '')} | Spaces`,
      bodyId: 'space-detail',
      bodyClass: 'page page-space-detail'
    }

    res.locals.props = {
      space: toJSON(space)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const createSpace = async (req, res) => {
  const userId = get(req, 'user.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({ err: 'Not authorized' })
  }

  try {
    const space = await create(
      merge(req.body, {
        createdBy: userId,
        updatedBy: userId
      })
    )

    const user = await updateUser(userId, {
      $addToSet: { spaces: toObjectId(space) }
    })

    req.logIn(user, () => res.status(200).json(space))
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

export const redesignSpace = async (req, res) => {
  const userId = get(req, 'user.id')
  const spaceId = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: { genereic: 'Not authorized' }
    })
  }

  try {
    const originalSpace = await findById(spaceId)
    const originalSpaceProps = toJSON(originalSpace)

    const space = await create(
      merge(req.body, {
        image: get(originalSpaceProps, 'image', ''),
        products: get(originalSpaceProps, 'products', []),
        spaceType: get(originalSpaceProps, 'spaceType', {}),
        createdBy: userId,
        updatedBy: userId
      })
    )

    await update(spaceId, {
      $inc: { redesignsCount: 1 }
    })

    const user = await updateUser(userId, {
      $addToSet: { spaces: toObjectId(space) }
    })

    req.logIn(user, () => res.status(200).json(space))
  } catch (err) {
    res.status(500).json({ err })
  }
}
