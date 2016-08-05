import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'
import truncate from 'lodash/truncate'
import React, { Component, PropTypes } from 'react'

import Avatar from './Avatar'
import CuratorBadge from './CuratorBadge'
import FollowButton from '../common/FollowButton'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

export default class ProfileCard extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  static defaultProps = {
    user: {}
  }

  renderCounters() {
    const { props } = this
    const likesCount = size(get(props.user, 'likes', []))
    const spacesCount = size(get(props.user, 'spaces', []))
    const commentsCount = size(get(props.user, 'comments', []))
    const followersCount = get(props.user, 'followersCount', 0)

    return (
      <div className="profile-card-stats">
        <div className="profile-card-stat">
          <div className="profile-card-stat-number">
            {followersCount}
          </div>
          <div className="profile-card-stat-text">
            {inflect(followersCount, 'Follower')}
          </div>
        </div>
        <div className="profile-card-stat">
          <div className="profile-card-stat-number">
            {spacesCount}
          </div>
          <div className="profile-card-stat-text">
            {inflect(spacesCount, 'Space')}
          </div>
        </div>
        <div className="profile-card-stat">
          <div className="profile-card-stat-number">
            {likesCount}
          </div>
          <div className="profile-card-stat-text">
            {inflect(likesCount, 'Like')}
          </div>
        </div>
        <div className="profile-card-stat">
          <div className="profile-card-stat-number">
            {commentsCount}
          </div>
          <div className="profile-card-stat-text">
            {inflect(commentsCount, 'Comment')}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { props } = this

    const url = `/${get(props.user, 'detailUrl', '')}/`
    const bio = truncate(get(props.user, 'bio', ''), {
      length: 70,
      separator: '...'
    })
    const userId = toStringId(props.user)
    const username = get(props.user, 'username', '')
    const userHandler = `@${username}`

    return (
      <a href={url} className="card profile-card">
        <div className="profile-card-info">
          <Avatar
            user={props.user}
            className="profile-card-avatar"
            {...merge({ width: 80, height: 80 }, props)}
          />
          <div className="profile-card-info-right">
            <div className="profile-card-name-container">
              <div className="profile-card-name-container-left">
                <div className="profile-card-name">
                  {get(props.user, 'name', username)}
                </div>
                <div className="profile-card-username">
                  {userHandler}
                  <CuratorBadge user={props.user} size={16} />
                </div>
              </div>
              <FollowButton
                parent={userId}
                className="button--tiny profile-card-follow"
                parentType="user"
                hideWhenLoggedOut
              />
            </div>
            {!isEmpty(bio) ? (
              <p className="profile-card-bio">{bio}</p>
            ) : null}
          </div>
        </div>
        {this.renderCounters()}
      </a>
    )
  }
}
