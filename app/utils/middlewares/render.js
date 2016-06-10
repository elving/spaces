import get from 'lodash/get'
import React from 'react'
import merge from 'lodash/merge'
import isError from 'lodash/isError'
import isEmpty from 'lodash/isEmpty'
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router'

import routes from '../../routes/client'
import metadata from '../../constants/metadata'
import getVersion from '../getVersion'
import getFullUrl from '../getFullUrl'
import isAuthenticatedUser from '../user/isAuthenticatedUser'

export default (req, res) => {
  const { user } = req
  const { csrf, props } = res.locals

  if (isError(get(props, 'error'))) {
    props.error = get(props, 'error.message', 'Something went wrong.')
  }

  if (isError(get(props, 'errors'))) {
    props.errors = get(props, 'errors.message', 'Something went wrong.')
  }

  const serverProps = merge({ csrf }, props)

  if (isAuthenticatedUser(user)) {
    serverProps.user = user
  }

  match({ routes, location: req.url }, (err, redirect, routerProps) => {
    if (redirect) {
      res.redirect(301, redirect.pathname + redirect.search)
    } else if (err) {
      console.log(err)
      res.redirect('/500/')
    } else if (isEmpty(routerProps)) {
      res.redirect('/400/')
    } else {
      const html = renderToString(React.createFactory(RouterContext)({
        ...routerProps,
        createElement: (Component, props) => (
          React.createElement(Component, {
            ...props, ...serverProps
          })
        )
      }))

      if (isEmpty(res.locals.metadata)) {
        res.locals.metadata = {
          title: metadata.title,
          bodyId: '',
          bodyClass: ''
        }
      }

      if (isEmpty(get(res, 'locals.metadata.title'))) {
        res.locals.metadata.title = metadata.title
      }

      if (isEmpty(res.locals.metadata.bodyClass)) {
        res.locals.metadata.bodyClass = ''
      }

      if (isAuthenticatedUser(user)) {
        res.locals.metadata.bodyClass = (
          `user-logged-in ${res.locals.metadata.bodyClass}`
        )
      } else {
        res.locals.metadata.bodyClass = (
          `user-logged-out ${res.locals.metadata.bodyClass}`
        )
      }

      if (isEmpty(res.locals.og)) {
        res.locals.og = {
          ogUrl: getFullUrl(req),
          ogTitle: metadata.title,
          ogImage: metadata.image,
          ogSiteName: metadata.siteName,
          ogDescription: metadata.description
        }
      }

      if (isEmpty(res.locals.og.ogUrl)) {
        res.locals.og.ogUrl = getFullUrl(req)
      }

      if (isEmpty(res.locals.og.ogTitle)) {
        res.locals.og.ogTitle = metadata.title
      }

      if (isEmpty(res.locals.og.ogImage)) {
        res.locals.og.ogImage = metadata.image
      }

      if (isEmpty(res.locals.og.ogSiteName)) {
        res.locals.og.ogSiteName = metadata.siteName
      }

      if (isEmpty(res.locals.og.ogDescription)) {
        res.locals.og.ogDescription = metadata.description
      }

      res.render('index', {
        env: process.env.NODE_ENV || 'development',
        fbId: process.env.FACEBOOK_ID,
        user: get(serverProps, 'user', {}),
        version: getVersion(),
        metadata: res.locals.metadata || { title: metadata.title },
        reactProps: serverProps,
        html,
        ...res.locals.og
      })
    }
  })
}
