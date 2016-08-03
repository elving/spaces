import get from 'lodash/get'
import search from '../api/user/search'
import setProps from '../utils/middlewares/setProps'
import setMetadata from '../utils/middlewares/setMetadata'
import findByUsername from '../api/user/findByUsername'

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
