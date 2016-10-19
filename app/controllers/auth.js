import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import passport from 'passport'
import { default as queryString } from 'query-string'

import invites from '../constants/invites'
import sendMail from '../utils/sendMail'
import metadata from '../constants/metadata'
import setProps from '../utils/middlewares/setProps'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import { default as findUser } from '../api/user/find'
import { default as createUser } from '../api/user/create'
import { default as resetUserPassword } from '../api/user/resetPassword'

import {
  default as claimPasswordResetRequest
} from '../api/passwordReset/claim'

import {
  default as createPasswordResetRequest
} from '../api/passwordReset/create'

import {
  default as validatePasswordResetRequest
} from '../api/passwordReset/validate'

export const redirectToJoin = (req, res) => {
  res.redirect('/join/')
}

export const renderJoin = (req, res, next) => {
  if (isAuthenticatedUser(req.user)) {
    return res.redirect(`/designers/${req.user.username}/`)
  }

  const invite = get(req, 'query.invite')

  if (isEmpty(invite) || !includes(invites, invite)) {
    return res.redirect('/')
  }

  setMetadata(res, {
    title: 'Join | Spaces',
    bodyId: 'join',
    bodyClass: 'page page-auth page-join'
  })

  if (!isEmpty(req.query)) {
    setProps(res, {
      fields: req.query
    })
  }

  next()
}

export const join = async (req, res, next) => {
  try {
    const user = await createUser(req.body)

    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }

      Reflect.deleteProperty(req.session, 'returnTo')
      res.status(200).json({ user })
    })
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const redirectToLogin = (req, res) => {
  res.redirect('/login/')
}

export const renderLogin = (req, res, next) => {
  if (isAuthenticatedUser(req.user)) {
    return res.redirect(`/designers/${req.user.username}/`)
  }

  setMetadata(res, {
    title: 'Login | Spaces',
    bodyId: 'login',
    bodyClass: 'page page-auth page-login'
  })

  next()
}

export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, failure) => {
    if (err) {
      return res.status(500).json({
        err: { generic: 'There was an error while trying to login.' }
      })
    }

    if (isEmpty(user)) {
      return res.status(500).json({
        err: { generic: failure.message }
      })
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({
          err: { generic: 'There was an error while trying to login.' }
        })
      }

      res.status(200).json({ user })
    })
  })(req, res, next)
}

export const authCallback = (req, res) => {
  let socialNetwork

  if ((/twitter/).test(req.url)) {
    socialNetwork = 'twitter'
  } else if ((/facebook/).test(req.url)) {
    socialNetwork = 'facebook'
  }

  if (!isEmpty(req.user) && !isAuthenticatedUser(req.user)) {
    return res.redirect(`/join/?${queryString.stringify({
      ...req.user,
      socialNetwork,
      settings: { onboarding: true }
    })}`)
  }

  const redirectTo = req.session.returnTo || 'back'
  Reflect.deleteProperty(req.session, 'returnTo')
  res.redirect(redirectTo)
}

export const renderResetPassword = (req, res, next) => {
  if (isAuthenticatedUser(req.user)) {
    return res.redirect(`/designers/${req.user.username}/`)
  }

  setMetadata(res, {
    title: 'Reset Password | Spaces',
    bodyId: 'reset-password',
    bodyClass: 'page page-auth page-reset-password'
  })

  next()
}

export const requestPasswordReset = async (req, res) => {
  const username = get(req, 'user')
  const emailOrUsername = get(req, 'body.emailOrUsername')

  if (isAuthenticatedUser(req.user)) {
    return res.redirect(`/designers/${username}/`)
  }

  try {
    const user = await findUser(emailOrUsername)
    const email = get(user, 'email')

    if (!isEmpty(email)) {
      const request = await createPasswordResetRequest(email)
      const passwordResetUrl = (
        `${metadata.url}set-password/${get(request, 'code')}/`
      )

      try {
        await sendMail({
          to: email,
          text: (
            'You previously requested to reset your password. \n' +
            'Use this link to set a new password for your account: \n\n' +
            `${passwordResetUrl}`
          ),
          html: (
            '<h1>You previously requested to reset your password.</h1>' +
            '<p>Use this link to set a new password for your account:</p>' +
            `<p><a href="${passwordResetUrl}">${passwordResetUrl}</a></p>`
          ),
          subject: 'Spaces | Password Reset Request',
        })

        res.status(200).json({ success: true })
      } catch (err) {
        res.status(500).json({
          err: {
            generic: (
              'There was an error while sending you the instructions. ' +
              'Please try again.'
            )
          }
        })
      }
    } else {
      res.status(500).json({
        err: {
          generic: 'No account found with the username or email you entered.'
        }
      })
    }
  } catch (err) {
    res.status(500).json({
      err: {
        generic: (
          'There was an error while finding your account. ' +
          'Please try again.'
        )
      }
    })
  }
}

export const renderSetPassword = async (req, res, next) => {
  const code = get(req, 'params.code')

  try {
    const request = await validatePasswordResetRequest(code)

    setMetadata(res, {
      title: 'Set Password | Spaces',
      bodyId: 'set-password',
      bodyClass: 'page page-auth page-set-password'
    })

    setProps(res, {
      code,
      email: get(request, 'email')
    })

    next()
  } catch (err) {
    res.redirect('/404/')
  }
}

export const setPassword = async (req, res) => {
  const code = get(req, 'params.code')

  try {
    await validatePasswordResetRequest(code)

    try {
      const user = await resetUserPassword(req.body)

      req.logIn(user, async (err) => {
        if (err) {
          return res.status(500).json({ err })
        }

        await claimPasswordResetRequest(code)
        Reflect.deleteProperty(req.session, 'returnTo')
        res.status(200).json({ success: true })
      })
    } catch (passwordRequestErr) {
      res.status(500).json({ err: passwordRequestErr })
    }
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const logout = (req, res) => {
  req.logOut()
  res.redirect('/login/')
}
