import get from 'lodash/get'
import update from '../api/user/update'
import search from '../api/user/search'
import getEmail from '../api/user/getEmail'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import toStringId from '../api/utils/toStringId'
import setMetadata from '../utils/middlewares/setMetadata'
import updatePassword from '../api/user/updatePassword'
import findByUsername from '../api/user/findByUsername'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

export const renderIndex = async (req, res, next) => {
  try {
    const results = await search()

    setMetadata(res, {
      title: 'Discover Designers | Spaces',
      bodyId: 'all-users',
      bodyClass: 'page page-all-users'
    })

    setProps(res, results)
    next()
  } catch (err) {
    next(err)
  }
}

export const redirectToProfileSpaces = (req, res) => {
  res.redirect(`/designers/${get(req, 'params.username')}/spaces/`)
}

export const renderProfile = async (req, res, next) => {
  try {
    const profile = await findByUsername(
      get(req, 'params.username')
    )

    setMetadata(res, {
      title: `${get(profile, 'username', 'user')}'s Profile | Spaces`,
      bodyId: 'user-profile',
      bodyClass: 'page page-user-profile'
    })

    setProps(res, { profile })
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
