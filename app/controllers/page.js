import setOgTags from '../utils/middlewares/setOgTags'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

export const renderLanding = (req, res, next) => {
  if (isAuthenticatedUser(req.user)) {
    return res.redirect('/popular/')
  }

  setOgTags(req, res, {
    ogTitle: 'Spaces | Get Early Access'
  })

  setMetadata(res, {
    title: 'Spaces | Get Early Access',
    bodyId: 'landing',
    bodyClass: 'landing'
  })

  next()
}

export const renderAbout = (req, res, next) => {
  setOgTags(req, res, {
    ogTitle: 'Spaces | About'
  })

  setMetadata(res, {
    title: 'Spaces | About',
    bodyId: 'page',
    bodyClass: 'page'
  })

  next()
}

export const renderTerms = (req, res, next) => {
  setOgTags(req, res, {
    ogTitle: 'Spaces | Terms of Service'
  })

  setMetadata(res, {
    title: 'Spaces | Terms of Service',
    bodyId: 'page',
    bodyClass: 'page'
  })

  next()
}

export const renderPrivacy = (req, res, next) => {
  setOgTags(req, res, {
    ogTitle: 'Spaces | Privacy Policy'
  })

  setMetadata(res, {
    title: 'Spaces | Privacy Policy',
    bodyId: 'page',
    bodyClass: 'page'
  })

  next()
}

export const renderCopyright = (req, res, next) => {
  setOgTags(req, res, {
    ogTitle: 'Spaces | Copyright'
  })

  setMetadata(res, {
    title: 'Spaces | Copyright',
    bodyId: 'page',
    bodyClass: 'page'
  })

  next()
}
