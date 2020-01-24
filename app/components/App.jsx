import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import isAdmin from '../utils/user/isAdmin'
import canModify from '../utils/user/canModify'
import isCurator from '../utils/user/isCurator'
import toStringId from '../api/utils/toStringId'
import { init as initAnalytics } from '../utils/analytics'

export default class App extends Component {
  static propTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    user: {},
    csrf: ''
  }

  static childContextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    userLoggedIn: PropTypes.func,
    currentUserIsOwner: PropTypes.func,
    currentUserIsAdmin: PropTypes.func,
    currentUserIsCurator: PropTypes.func,
    currentUserIsOnboarding: PropTypes.func
  }

  getChildContext() {
    const { props } = this

    return {
      csrf: props.csrf,
      user: props.user,
      userLoggedIn: () => !isEmpty(props.user),
      currentUserIsAdmin: () => isAdmin(props.user),
      currentUserIsOwner: model => canModify(props.user, model),
      currentUserIsCurator: () => isCurator(props.user),
      currentUserIsOnboarding: () => (
        get(props.user, 'settings.onboarding', true)
      )
    }
  }

  componentDidMount() {
    const { props } = this

    initAnalytics(
      toStringId(props.user),
      get(props.location, 'pathname', '/')
    )
  }

  render() {
    return this.props.children
  }
}
