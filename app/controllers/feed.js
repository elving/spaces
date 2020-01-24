import toJSON from '../api/utils/toJSON'
import getFeed from '../api/user/getFeed'
import setProps from '../utils/middlewares/setProps'
import toStringId from '../api/utils/toStringId'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

export const renderFeed = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/login/')
  }

  try {
    const feed = await getFeed(toStringId(req.user))

    setMetadata(res, {
      title: 'Your Feed | Spaces',
      bodyId: 'feed',
      bodyClass: 'page page-feed'
    })

    setProps(res, {
      feed: toJSON(feed)
    })

    next()
  } catch (err) {
    next(err)
  }
}
