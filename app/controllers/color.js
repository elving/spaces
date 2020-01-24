import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/color/getAll'
import create from '../api/color/create'
import update from '../api/color/update'
import destroy from '../api/color/destroy'
import findBySid from '../api/color/findBySid'

export const renderAllColors = async (req, res, next) => {
  try {
    const colors = await getAll()

    setMetadata(res, {
      title: 'All Colors | Spaces',
      bodyId: 'all-colors',
      bodyClass: 'page page-all-colors page-admin-table'
    })

    setProps(res, {
      colors: toJSON(colors)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAddColor = (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  setMetadata(res, {
    title: 'Add Color | Spaces',
    bodyId: 'add-color',
    bodyClass: 'page page-add-color page-crud-color'
  })

  next()
}

export const addColor = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const color = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(color)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateColor = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  if (isEqual(sid, 'add') || isEmpty(sid)) {
    next()
  }

  try {
    const color = await findBySid(sid)

    setMetadata(res, {
      title: 'Update Color | Spaces',
      bodyId: 'update-color',
      bodyClass: 'page page-update-color page-crud-color'
    })

    setProps(res, {
      color: toJSON(color)
    })

    if (isEmpty(color)) {
      res.redirect('/404/')
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const updateColor = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const color = await update(sid, req.body)
    res.status(200).json(color)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroyColor = async (req, res) => {
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
