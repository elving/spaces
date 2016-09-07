import get from 'lodash/get'
import merge from 'lodash/merge'
import React, { Component, PropTypes } from 'react'

import Avatar from '../user/Avatar'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class MiniProfile extends Component {
  static propTypes = {
    space: PropTypes.object
  }

  static defaultProps = {
    space: {}
  }

  render() {
    const { props } = this

    return (
      <div
        className="redesign-badge tooltip"
        data-tooltip={
          `Redesigned from @${get(props.space, 'createdBy.username')}`
        }
      >
        <a
          href={`/${get(props.space, 'originalSpace.detailUrl', '')}/`}
          className="redesign-badge-link"
        >
          <Avatar
            user={get(props.space, 'createdBy', {})}
            {...merge({ width: 40, height: 40 }, props)}
          />
          <span className="redesign-badge-icon-container">
            <MaterialDesignIcon
              name="redesign"
              size={14}
              className="redesign-badge-icon"
            />
          </span>
        </a>
      </div>
    )
  }
}
