import ga from 'react-ga'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

import metadata from '../constants/metadata'

export default class App extends Component {
  static childContextTypes = {
    user: Type.object,
    csrf: Type.string,
    userLoggedIn: Type.func,
    currentUserIsOwner: Type.func,
    currentUserIsAdmin: Type.func,
    currentUserIsCurator: Type.func
  };

  getChildContext() {
    return {
      user: this.props.user,
      csrf: this.props.csrf,
      userLoggedIn: (() => !isEmpty(this.props.user)),
      currentUserIsAdmin: (() => get(this.props, 'user.isAdmin')),
      currentUserIsOwner: ((id) => get(this.props, 'user.id') === id),
      currentUserIsCurator: (() => get(this.props, 'user.isCurator'))
    }
  }

  componentDidMount() {
    const userId = get(this.props, 'user.id')

    if (!isEmpty(userId)) {
      ga.initialize(metadata.googleAnalyticsUA, {
        gaOptions: {
          userId,
          cookieDomain: 'auto'
        }
      })
    } else {
      ga.initialize(metadata.googleAnalyticsUA)
    }

    ga.pageview(this.props.location.pathname)
  }

  render() {
    return this.props.children
  }
}
