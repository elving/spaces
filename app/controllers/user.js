import search from '../api/user/search'

import { toJSON } from '../api/utils'

export const renderIndex = async (req, res, next) => {
  try {
    const users = await search()

    res.locals.metadata = {
      title: 'Discover Designers | Spaces',
      bodyId: 'all-users',
      bodyClass: 'page page-all-users'
    }

    res.locals.props = {
      users: toJSON(users)
    }

    next()
  } catch (err) {
    next(err)
  }
}
