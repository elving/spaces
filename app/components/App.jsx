import ga from 'react-ga'
import get from 'lodash/get'
import set from 'lodash/set'
import map from 'lodash/map'
import clone from 'lodash/clone'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

import metadata from '../constants/metadata'
import toStringId from '../utils/toStringId'
import createProductsMap from '../utils/space/createProductsMap'

export default class App extends Component {
  constructor(props) {
    super(props)

    const userSpaces = get(props, 'user.spaces', [])

    this.state = {
      userSpaces,
      userSpacesProductsMap: createProductsMap(userSpaces)
    }
  }

  static childContextTypes = {
    user: Type.object,
    csrf: Type.string,
    spaceTypes: Type.array,
    userLoggedIn: Type.func,
    currentUserIsOwner: Type.func,
    currentUserIsAdmin: Type.func,
    currentUserIsCurator: Type.func,

    userSpaces: Type.array,
    updateSpace: Type.func,
    userSpacesProductsMap: Type.object
  };

  getChildContext() {
    return {
      user: this.props.user,
      csrf: this.props.csrf,
      spaceTypes: this.props.spaceTypes,
      userLoggedIn: (() => !isEmpty(this.props.user)),
      currentUserIsAdmin: (() => get(this.props, 'user.isAdmin')),
      currentUserIsOwner: ((id) => get(this.props, 'user.id') === id),
      currentUserIsCurator: (() => get(this.props, 'user.isCurator')),

      userSpaces: this.state.userSpaces,
      updateSpace: ::this.updateSpace,
      userSpacesProductsMap: this.state.userSpacesProductsMap
    }
  }

  updateSpace(space, products) {
    const userSpacesProductsMap = clone(this.state.userSpacesProductsMap)
    set(userSpacesProductsMap, toStringId(space), map(products, toStringId))
    this.setState({ userSpacesProductsMap })
  }

  componentDidMount() {
    const userId = get(this.props, 'user.id')

    if (!isEmpty(userId)) {
      ga.initialize(metadata.googleAnalyticsUA, {
        gaOptions: { userId, cookieDomain: 'auto' }
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
