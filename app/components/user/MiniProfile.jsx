import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import React, { Component, PropTypes } from 'react'

import Avatar from './Avatar'
import CuratorBadge from './CuratorBadge'
import FollowButton from '../common/FollowButton'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

export default class MiniProfile extends Component {
  static contextTypes = {
    user: PropTypes.object
  }

  static propTypes = {
    user: PropTypes.object
  }

  static defaultProps = {
    user: {}
  }

  onToggleFollowClick = (event) => {
    event.preventDefault()
  }

  render() {
    const { props, context } = this

    const userId = toStringId(props.user)
    const username = get(props.user, 'username', '')
    const spacesCount = size(get(props.user, 'spaces', []))
    const currentUserId = toStringId(context.user)
    const followersCount = get(props.user, 'followersCount', 0)

    return (
      <a
        href={`/${get(props.user, 'detailUrl', '')}/`}
        className="user-mini-profile"
      >
        <div className="user-mini-profile-left">
          <Avatar
            user={props.user}
            {...merge({ width: 52, height: 52 }, props)}
          />
        </div>
        <div className="user-mini-profile-right">
          <div className="user-mini-profile-info">
            <div className="user-mini-profile-username">
              {size(username) > 15 ? (
                <div className="tooltip" data-tooltip={`@${username}`}>
                  <div className="user-mini-profile-username-text">
                    {`@${username}`}
                    <CuratorBadge user={props.user} size={16} />
                  </div>
                </div>
              ) : (
                <div className="user-mini-profile-username-text">
                  {`@${username}`}
                  <CuratorBadge user={props.user} size={16} />
                </div>
              )}
            </div>
            {userId !== currentUserId ? (
              <FollowButton
                parent={userId}
                className="button--mini"
                parentType="user"
                hideWhenLoggedOut
              />
            ) : null}
          </div>
          <div className="user-mini-profile-stats">
            <div className="user-mini-profile-stat">
              {`${followersCount} ${inflect(followersCount, 'Follower')}`}
            </div>
            <div className="user-mini-profile-stat">
              {`${spacesCount} ${inflect(spacesCount, 'Space')}`}
            </div>
          </div>
        </div>
      </a>
    )
  }
}
