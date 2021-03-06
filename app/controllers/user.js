import get from 'lodash/get'

import toJSON from '../api/utils/toJSON'
import update from '../api/user/update'
import search from '../api/user/search'
import getLikes from '../api/user/getLikes'
import getEmail from '../api/user/getEmail'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import getFollows from '../api/user/getFollows'
import toStringId from '../api/utils/toStringId'
import setMetadata from '../utils/middlewares/setMetadata'
import getRecommended from '../api/productRecommendation/getAll'
import updatePassword from '../api/user/updatePassword'
import findByUsername from '../api/user/findByUsername'
import getProfileCounts from '../api/user/getProfileCounts'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

export const renderIndex = async (req, res, next) => {
  try {
    const results = await search()

    setOgTags(req, res, {
      ogTitle: 'Discover awesome people on Spaces'
    })

    setMetadata(res, {
      title: 'Discover People | Spaces',
      bodyId: 'all-users',
      bodyClass: 'page page-all-users'
    })

    setProps(res, results)

    next()
  } catch (err) {
    next(err)
  }
}

export const renderFriends = (req, res, next) => {
  setOgTags(req, res, {
    ogTitle: 'Invite your friends over to Spaces'
  })

  setMetadata(res, {
    title: 'Invite Your Friends | Spaces',
    bodyId: 'friends',
    bodyClass: 'page page-friends'
  })

  next()
}

export const redirectToProfileSpaces = (req, res) => {
  res.redirect(`/u/${get(req, 'params.username')}/spaces/`)
}

export const renderProfile = async (req, res, next) => {
  try {
    const profile = await findByUsername(get(req, 'params.username'))
    const counters = await getProfileCounts(toStringId(profile))
    const username = get(profile, 'username', 'user')

    setOgTags(req, res, {
      ogTitle: `@${username}'s profile on Spaces`
    })

    setMetadata(res, {
      title: `${username}'s Profile | Spaces`,
      bodyId: 'user-profile',
      bodyClass: 'page page-user-profile'
    })

    setProps(res, { profile, counters })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderProfileForm = async (req, res, next) => {
  const username = get(req, 'params.username')

  try {
    if (!isAuthenticatedUser(req.user)) {
      return res.redirect('/404/')
    }

    if (get(req, 'user.username') !== username) {
      return res.redirect('/404/')
    }

    const email = await getEmail(username)

    setMetadata(res, {
      title: 'Edit Your Profile | Spaces',
      bodyId: 'user-profile',
      bodyClass: 'page page-user-edit-profile'
    })

    setProps(res, { email })

    next()
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  const id = get(req, 'params.id')

  try {
    if (!isAuthenticatedUser(req.user)) {
      res.status(500).json({
        err: {
          generic: 'Not authorized'
        }
      })
    }

    if (toStringId(req.user) !== id) {
      res.status(500).json({
        err: {
          generic: 'Not authorized'
        }
      })
    }

    const user = await update(toStringId(req.user), req.body)

    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }

      res.status(200).json(user)
    })
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const showPassword = (req, res, next) => {
  const username = get(req, 'params.username')

  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  if (get(req, 'user.username') !== username) {
    return res.redirect('/404/')
  }

  setProps(res, {
    profile: req.profile
  })

  setMetadata(res, {
    title: 'Change Password | Spaces',
    bodyId: 'user-profile',
    bodyClass: 'page page-user-change-password'
  })

  next()
}

export const changePassword = async (req, res, next) => {
  const id = get(req, 'params.id')

  try {
    if (!isAuthenticatedUser(req.user)) {
      res.status(500).json({
        err: {
          generic: 'Not authorized'
        }
      })
    }

    if (toStringId(req.user) !== id) {
      res.status(500).json({
        err: {
          generic: 'Not authorized'
        }
      })
    }

    const user = await updatePassword(toStringId(req.user), req.body)

    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }

      res.status(200).json(user)
    })
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const getUserLikes = async (req, res) => {
  const id = get(req, 'params.id')

  try {
    const user = await getLikes(id)

    res.status(200).json(get(user, 'likes', []))
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const getUserFollows = async (req, res) => {
  const id = get(req, 'params.id')

  try {
    const user = await getFollows(id)

    res.status(200).json(get(user, 'following', []))
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderRecommended = async (req, res, next) => {
  const username = get(req, 'params.username')

  try {
    if (!isAuthenticatedUser(req.user)) {
      return res.redirect('/404/')
    }

    if (get(req, 'user.username') !== username) {
      return res.redirect('/404/')
    }

    const recommendations = await getRecommended({
      createdBy: toStringId(req.user)
    })

    setMetadata(res, {
      title: 'Your Recommendations | Spaces',
      bodyId: 'user-profile',
      bodyClass: 'page page-profile'
    })

    setProps(res, { recommendations: toJSON(recommendations) })

    next()
  } catch (err) {
    next(err)
  }
}
