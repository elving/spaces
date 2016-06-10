import ga from 'react-ga'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import React, { Component, PropTypes as Type } from 'react'

import metadata from '../constants/metadata'
import updateSpace from '../utils/space/updateSpace'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: get(props, 'userData', {
        spaces: []
      })
    }
  }

  static childContextTypes = {
    user: Type.object,
    csrf: Type.string,
    userData: Type.object,
    spaceTypes: Type.array,
    userLoggedIn: Type.func,
    addUserSpace: Type.func,
    onSpaceUpdated: Type.func,
    currentUserIsOwner: Type.func,
    currentUserIsAdmin: Type.func,
    currentUserIsCurator: Type.func
  };

  getChildContext() {
    return {
      user: this.props.user,
      csrf: this.props.csrf,
      userData: this.state.userData,
      spaceTypes: this.props.spaceTypes,
      userLoggedIn: (() => !isEmpty(this.props.user)),
      addUserSpace: ((space) => {
        const userData = cloneDeep(this.state.userData)
        userData.spaces.push(space)
        this.setState({ userData })
      }),
      onSpaceUpdated: ((space) => {
        const { userData } = this.state
        this.setState({ userData: updateSpace(userData, space) })
      }),
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
