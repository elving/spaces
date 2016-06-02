import get from 'lodash/get'
import React, { Component, PropTypes as Type } from 'react'

import Avatar from './Avatar'

export default class CurrentUserAvatar extends Component {
  static contextTypes = {
    user: Type.object
  };

  render() {
    const { user } = this.context

    return (
      <Avatar
        {...this.props}
        initials={get(user, 'initials', '')}
        imageUrl={get(user, 'avatar', '')}/>
    )
  }
}
