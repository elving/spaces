import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Followers from '../follow/Followers'
import toStringId from '../../api/utils/toStringId'

export default class ProfileFollowers extends Component {
  static propTypes = {
    profile: PropTypes.object
  }

  static defaultProps = {
    profile: {}
  }

  render() {
    const { props } = this

    return (
      <Followers
        params={{ parent: toStringId(props.profile) }}
        emptyMessage={`${get(props.profile, 'name')} has no followers yet...`}
      />
    )
  }
}
