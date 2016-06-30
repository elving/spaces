import search from '../api/user/search'

export const renderIndex = async (req, res, next) => {
  try {
    res.locals.metadata = {
      title: 'Discover Designers | Spaces',
      bodyId: 'all-users',
      bodyClass: 'page page-all-users'
    }

    res.locals.props = await search()
    next()
  } catch (err) {
    next(err)
  }
}
