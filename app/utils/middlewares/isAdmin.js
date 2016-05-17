import isAuthenticatedUser from '../isAuthenticatedUser'

export default (req, res, next) => {
  if (isAuthenticatedUser(req.user) && req.user.isAdmin) {
    return next()
  }

  res.redirect('/login/')
}
