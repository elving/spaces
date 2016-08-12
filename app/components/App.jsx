import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'

import toStringId from '../api/utils/toStringId'
import initAnalytics from '../utils/initAnalytics'

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
    currentUserIsCurator: PropTypes.func
  }

  getChildContext() {
    const { props } = this

    return {
      csrf: props.csrf,
      user: props.user,
      userLoggedIn: () => !isEmpty(props.user),
      currentUserIsAdmin: () => get(props.user, 'isAdmin'),
      currentUserIsOwner: id => isEqual(toStringId(props.user), id),
      currentUserIsCurator: () => (
        get(props.user, 'isCurator') || get(props.user, 'isAdmin')
      )
    }
  }

  componentDidMount() {
    const { props } = this
    initAnalytics(toStringId(props.user), get(props.location, 'pathname'))
  }

  render() {
    return this.props.children
  }
}
