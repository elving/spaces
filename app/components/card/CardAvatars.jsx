import get from 'lodash/get'
import map from 'lodash/map'
import React, { Component, PropTypes } from 'react'

import Avatar from '../user/Avatar'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import inflect from '../../utils/inflect'

export default class CardTags extends Component {
  static propTypes = {
    verb: PropTypes.string,
    users: PropTypes.array,
    count: PropTypes.number,
    action: PropTypes.string,
    avatarSize: PropTypes.number
  };

  static defaultProps = {
    verb: '',
    users: [],
    count: 0,
    action: '',
    avatarSize: 28
  };

  getIconName() {
    const { props } = this

    switch (props.action) {
      case 'liked': {
        return 'like'
      }

      case 'commented': {
        return 'comment'
      }

      default: {
        return null
      }
    }
  }

  renderIcon() {
    const { props } = this

    return (
      <span
        style={{
          width: props.avatarSize + 2,
          height: props.avatarSize + 2
        }}
        className="card-avatars-icon"
        data-action={props.action}
      >
        <MaterialDesignIcon name={this.getIconName()} size={15} />
      </span>
    )
  }

  renderAvatars() {
    const { props } = this

    return (
      <div className="card-avatars-users">
        {map(props.users, user =>
          <Avatar
            style={{ marginLeft: -(props.avatarSize / 2.5) }}
            width={props.avatarSize}
            height={props.avatarSize}
            imageUrl={get(user, 'avatar', '')}
            initials={get(user, 'initials', '')}
            className="card-avatars-user"
          />
        )}
      </div>
    )
  }

  renderCount() {
    const { props } = this

    const readableCount = props.count > 5
      ? `+ ${props.count - 1}`
      : props.count

    const readableAction = props.count > 0
      ? `${inflect(props.count, 'person', 'people')} ${props.action}`
      : `Be the first to ${props.verb}`

    const text = props.count > 0
      ? `${readableCount} ${readableAction}`
      : readableAction

    return (
      <div className="card-avatars-count">
        {text}
      </div>
    )
  }

  render() {
    return (
      <div className="card-avatars">
        {this.renderIcon()}
        {this.renderAvatars()}
        {this.renderCount()}
      </div>
    )
  }
}
