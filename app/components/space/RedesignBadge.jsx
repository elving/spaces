import get from 'lodash/get'
import merge from 'lodash/merge'
import React, { Component, PropTypes as Type } from 'react'

import Avatar from '../user/Avatar'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class MiniProfile extends Component {
  static propTypes = {
    space: Type.object
  };

  static defaultProps = {
    space: {}
  };

  render() {
    const { space } = this.props

    const user = get(space, 'createdBy', {})
    const username = get(user, 'username', '')

    return (
      <div
        className="redesign-badge tooltip"
        data-tooltip={`Redesigned from @${username}`}>
        <a
          href={`/${get(space, 'detailUrl', '')}/`}
          className="redesign-badge-link">
          <Avatar
            initials={get(user, 'initials', '')}
            imageUrl={get(user, 'avatar', '')}
            {...merge({ width: 40, height: 40 }, this.props)}/>
          <span className="redesign-badge-icon-container">
            <MaterialDesignIcon
              name="redesign"
              size={14}
              className="redesign-badge-icon"/>
          </span>
        </a>
      </div>
    )
  }
}
