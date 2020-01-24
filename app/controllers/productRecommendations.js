import get from 'lodash/get'
import merge from 'lodash/merge'

import isAdmin from '../utils/user/isAdmin'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/productRecommendation/getAll'
import create from '../api/productRecommendation/create'
import update from '../api/productRecommendation/update'
import destroy from '../api/productRecommendation/destroy'

import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import setMetadata from '../utils/middlewares/setMetadata'

export const addRecommendation = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const recommendation = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(recommendation)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const updateRecommendation = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user) || !isAdmin(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const recommendation = await update(
      id, merge(req.body, {
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(recommendation)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroyRecommendation = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user) || !isAdmin(req.user)) {
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

export const renderAdmin = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user) || !isAdmin(req.user)) {
    return res.redirect('/404/')
  }

  try {
    const recommendations = await getAll()

    setMetadata(res, {
      title: 'Recommendations Admin | Spaces',
      bodyId: 'admin-recommendations',
      bodyClass: 'page page-admin-recommendations'
    })

    setProps(res, {
      recommendations: toJSON(recommendations)
    })

    next()
  } catch (err) {
    next(err)
  }
}
