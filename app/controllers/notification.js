import get from 'lodash/get'

import search from '../api/notification/search'
import getCount from '../api/notification/getCount'
import setOgTags from '../utils/middlewares/setOgTags'
import toStringId from '../api/utils/toStringId'
import setMetadata from '../utils/middlewares/setMetadata'
import markAllRead from '../api/notification/markAllRead'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

export const renderIndex = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  setOgTags(req, res, {
    ogTitle: 'Your notifications'
  })

  setMetadata(res, {
    title: 'Your Notifications | Spaces',
    bodyId: 'all-user-notifications',
    bodyClass: 'page page-user-notifications'
  })

  next()
}

export const getNotificationsCount = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const count = await getCount({
      unread: { $eq: true },
      recipient: toStringId(req.user)
    })

    res.status(200).json({ count })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to get your notifications count.'
        )
      }
    })
  }
}

export const getNotifications = async (req, res) => {
  const skip = get(req.query, 'skip', 0)
  const limit = get(req.query, 'limit', 5)

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const notifications = await search({
      skip,
      limit,
      unread: { $eq: true },
      recipient: toStringId(req.user)
    })

    res.status(200).json(notifications)
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: 'There was an error while trying to get your notifications.'
      }
    })
  }
}

export const getAllNotifications = async (req, res) => {
  const skip = get(req.query, 'skip', 0)
  const limit = get(req.query, 'limit', 5)

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const notifications = await search({
      skip,
      limit,
      recipient: toStringId(req.user)
    })

    res.status(200).json(notifications)
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: 'There was an error while trying to get your notifications.'
      }
    })
  }
}

export const markNotificationsRead = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    await markAllRead(toStringId(req.user))
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: 'There was an error while trying to get your notifications.'
      }
    })
  }
}
