import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'
import truncate from 'lodash/truncate'
import React, { Component, PropTypes as Type } from 'react'

import Avatar from './Avatar'
import FollowButton from '../common/FollowButton'

import inflect from '../../utils/inflect'

export default class ProfileCard extends Component {
  static contextTypes = {
    user: Type.object
  };

  static propTypes = {
    user: Type.object
  };

  static defaultProps = {
    user: {}
  };

  renderCounters() {
    const { user } = this.props
    const likesCount = size(get(user, 'likes', []))
    const spacesCount = size(get(user, 'spaces', []))
    const commentsCount = size(get(user, 'comments', []))
    const followersCount = get(user, 'followersCount', 0)

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
    const { user } = this.props

    const url = `/${get(user, 'detailUrl', '')}/`
    const bio = truncate(get(user, 'bio', ''), {
      'length': 140,
      'separator': '...'
    })
    const userId = get(user, 'id', '')
    const username = get(user, 'username', '')
    const userHandler = `@${username}`

    return (
      <a href={url} className="card profile-card">
        <div className="profile-card-info">
          <Avatar
            imageUrl={get(user, 'avatar', '')}
            initials={get(user, 'initials', '')}
            className="profile-card-avatar"
            {...merge({ width: 80, height: 80 }, this.props)}/>
          <div className="profile-card-info-right">
            <div className="profile-card-name-container">
              <div className="profile-card-name-container-left">
                <div className="profile-card-name">
                  {get(user, 'name', username)}
                </div>
                <div className="profile-card-username">
                  {userHandler}
                </div>
              </div>
              <FollowButton
                parent={userId}
                showText={false}
                className="button--tiny profile-card-follow"
                parentType="user"
                hideWhenLoggedOut={true}/>
            </div>
            {!isEmpty(bio) ?(
              <p className="profile-card-bio">{bio}</p>
            ) : null}
          </div>
        </div>
        {this.renderCounters()}
      </a>
    )
  }
}
