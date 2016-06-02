import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import React, { Component, PropTypes as Type } from 'react'

import Avatar from './Avatar'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class MiniProfile extends Component {
  static propTypes = {
    user: Type.object
  };

  static defaultProps = {
    user: {}
  };

  toggleFollow(event) {
    event.preventDefault()
  }

  render() {
    const { user } = this.props
    const username = get(user, 'username', '')

    return (
      <a
        href={`/${get(user, 'detailUrl', '')}/`}
        className="user-mini-profile">
        <div className="user-mini-profile-left">
          <Avatar
            {...merge({
              width: 52,
              height: 52
            }, this.props)}
            initials={get(user, 'initials', '')}
            imageUrl={get(user, 'avatar', '')}/>
        </div>
        <div className="user-mini-profile-right">
          <div className="user-mini-profile-info">
            <div className="user-mini-profile-username">
              {size(username) > 15 ? (
                <div className="tooltip" data-tooltip={`@${username}`}>
                  <div className="user-mini-profile-username-text">
                    {`@${username}`}
                  </div>
                </div>
              ) : (
                <div className="user-mini-profile-username-text">
                  {`@${username}`}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={::this.toggleFollow}
              className="button button--primary button--mini"
              data-action="follow-user">
              <MaterialDesignIcon name="follow-user" size={14}/>
              Follow
            </button>
          </div>
          <div className="user-mini-profile-stats">
            <div className="user-mini-profile-stat">
              9999 Followers
            </div>
            <div className="user-mini-profile-stat">
              9999 Spaces
            </div>
          </div>
        </div>
      </a>
    )
  }
}
