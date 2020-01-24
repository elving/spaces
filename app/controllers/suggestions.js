import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import toStringId from '../api/utils/toStringId'
import setMetadata from '../utils/middlewares/setMetadata'
import getSuggestions from '../api/user/getSuggestions'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

export const renderSuggestions = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/login/')
  }

  try {
    const suggestions = await getSuggestions(toStringId(req.user))

    setMetadata(res, {
      title: 'Your Suggestions | Spaces',
      bodyId: 'suggestions',
      bodyClass: 'page page-suggestions'
    })

    setProps(res, toJSON(suggestions))

    next()
  } catch (err) {
    next(err)
  }
}
