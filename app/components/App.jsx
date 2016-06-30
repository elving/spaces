import get from 'lodash/get'
import set from 'lodash/set'
import map from 'lodash/map'
import clone from 'lodash/clone'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes as Type } from 'react'

import toStringId from '../utils/toStringId'
import initAnalytics from '../utils/initAnalytics'
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

  static propTypes = {
    user: Type.object,
    csrf: Type.string,
    colors: Type.array,
    spaceTypes: Type.array,
    categories: Type.array
  };

  static defaultProps = {
    user: {},
    colors: [],
    spaceTypes: [],
    categories: []
  };

  static childContextTypes = {
    csrf: Type.string,

    colors: Type.array,
    categories: Type.array,
    spaceTypes: Type.array,

    user: Type.object,
    userLoggedIn: Type.func,
    currentUserIsOwner: Type.func,
    currentUserIsAdmin: Type.func,
    currentUserIsCurator: Type.func,

    userSpaces: Type.array,
    updateSpace: Type.func,
    userSpacesProductsMap: Type.object
  };

  getChildContext() {
    const { userSpaces, userSpacesProductsMap } = this.state
    const { csrf, user, colors, categories, spaceTypes } = this.props

    return {
      user,
      csrf,
      colors,
      categories,
      spaceTypes,

      userLoggedIn: (() => !isEmpty(user)),
      currentUserIsAdmin: (() => get(user, 'isAdmin')),
      currentUserIsOwner: ((id) => isEqual(get(user, 'id'), id)),
      currentUserIsCurator: (() => get(user, 'isCurator')),

      userSpaces,
      updateSpace: ::this.updateSpace,
      userSpacesProductsMap
    }
  }

  updateSpace(space, products) {
    const userSpacesProductsMap = clone(this.state.userSpacesProductsMap)
    set(userSpacesProductsMap, toStringId(space), map(products, toStringId))
    this.setState({ userSpacesProductsMap })
  }

  componentDidMount() {
    const { user, location } = this.props
    initAnalytics(get(user, 'id'), get(location, 'pathname'))
  }

  render() {
    return this.props.children
  }
}
