import isAuthenticatedUser from '../user/isAuthenticatedUser'

export default (req, res, next) => {
  if (isAuthenticatedUser(req.user)) {
    return next()
  }

  res.redirect('/login')
}
