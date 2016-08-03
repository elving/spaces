import React, { Component, PropTypes } from 'react'

import isCurator from '../../utils/user/isCurator'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CuratorBadge extends Component {
  static propTypes = {
    user: PropTypes.object,
    size: PropTypes.number
  };

  static defaultProps = {
    user: {},
    size: 18
  };

  render() {
    const { props } = this

    return isCurator(props.user) ? (
      <div
        className="user-curator-badge tooltip"
        data-tooltip="Curator"
      >
        <MaterialDesignIcon
          name="verified"
          fill="#439fe0"
          size={props.size}
          className="user-curator-badge-icon"
        />
      </div>
    ) : null
  }
}
