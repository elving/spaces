import React, { Component, PropTypes } from 'react'

import Avatar from './Avatar'

export default class CurrentUserAvatar extends Component {
  static contextTypes = {
    user: PropTypes.object
  };

  render() {
    const { context } = this

    return (
      <Avatar user={context.user} {...this.props} />
    )
  }
}
