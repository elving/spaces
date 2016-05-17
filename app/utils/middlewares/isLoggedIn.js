import isAuthenticatedUser from '../isAuthenticatedUser'

export default (req, res, next) => {
  if (isAuthenticatedUser(req.user)) {
    return next()
  }

  if (req.method === 'GET') {
    req.session.returnTo = req.url
  }

  res.redirect('/login')
}
