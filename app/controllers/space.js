import isAuthenticatedUser from '../utils/isAuthenticatedUser'

export const renderCreateSpace = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  res.locals.metadata = {
    title: 'Create Space | Spaces',
    bodyId: 'create-space',
    bodyClass: 'page page-create-space'
  }

  next()
}
