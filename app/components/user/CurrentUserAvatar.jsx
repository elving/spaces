import get from 'lodash/get'
import React, { Component, PropTypes as Type } from 'react'

import Avatar from './Avatar'

export default class CurrentUserAvatar extends Component {
  static contextTypes = {
    user: Type.object
  };

  render() {
    return (
      <Avatar
        {...this.props}
        initials={get(this.context.user, 'initials', '')}
        imageUrl={get(this.context.user, 'avatar.url', '')}/>
    )
  }
}
