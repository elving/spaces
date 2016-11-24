import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import { Link } from 'react-router'
import React, { PropTypes, PureComponent } from 'react'

import Layout from '../common/Layout'
import Avatar from './Avatar'
import FollowButton from '../common/FollowButton'
import CuratorBadge from './CuratorBadge'
import CreateSpaceBanner from '../onboarding/Banner'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'
import addTwitterLinks from '../../utils/addTwitterLinks'

export default class UserProfile extends PureComponent {
  static propTypes = {
    profile: PropTypes.object,
    counters: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    profile: {},
    counters: {}
  }

  static contextTypes = {
    user: PropTypes.object,
    currentUserIsOnboarding: PropTypes.func
  }

  isProfileOwner() {
    const { props, context } = this

    const userId = toStringId(context.user)
    const profileId = toStringId(props.profile)

    return (
      !isEmpty(userId) &&
      !isEmpty(profileId) &&
      userId === profileId
    )
  }

  renderHeader() {
    const { props } = this

    const bio = get(props.profile, 'bio')
    const username = get(props.profile, 'username')
    const profileId = toStringId(props.profile)

    return (
      <div className="user-profile-header">
        <div className="user-profile-header-info">
          <Avatar
            user={props.profile}
            width={82}
            height={82}
            className="user-profile-header-avatar"
          />

          <h1 className="user-profile-header-username">
            {get(props.profile, 'name')}
            <CuratorBadge user={props.profile} size={22} />
          </h1>

          {!isEmpty(bio) ? (
            <p
              className="user-profile-header-bio"
              dangerouslySetInnerHTML={{
                __html: addTwitterLinks(bio)
              }}
            />
          ) : null}

          <div className="user-profile-header-actions">
            <FollowButton
              parent={profileId}
              parentType="user"
            />
            {this.isProfileOwner() ? (
              <a
                href={`/designers/${username}/edit/`}
                className="button button--small button--primary-alt"
              >
                <span className="button-text">
                  Edit
                </span>
              </a>
            ) : null}
          </div>
        </div>

        {this.renderNavigation()}
      </div>
    )
  }

  renderNavigation() {
    const { props } = this

    const username = get(props.profile, 'username')
    const likesCount = get(props.counters, 'likes', 0)
    const spacesCount = get(props.counters, 'spaces', 0)
    const productsCount = get(props.counters, 'products', 0)
    const followersCount = get(props.counters, 'followers', 0)
    const followingCount = get(props.counters, 'following', 0)

    return (
      <nav className="navbar">
        <Link
          to={{ pathname: `/designers/${username}/spaces` }}
          className="navbar-link"
          activeClassName="is-active"
        >
          {`${spacesCount || ''} ${inflect(spacesCount, 'Space')}`}
        </Link>
        <Link
          to={{ pathname: `/designers/${username}/products` }}
          className="navbar-link"
          activeClassName="is-active"
        >
          {`${productsCount || ''} ${inflect(productsCount, 'Product')}`}
        </Link>
        <Link
          to={{ pathname: `/designers/${username}/likes` }}
          className="navbar-link"
          activeClassName="is-active"
        >
          {`${likesCount || ''} ${inflect(likesCount, 'Like')}`}
        </Link>
        <Link
          to={{ pathname: `/designers/${username}/followers` }}
          className="navbar-link"
          activeClassName="is-active"
        >
          {`${followersCount || ''} ${inflect(followersCount, 'Follower')}`}
        </Link>
        <Link
          to={{ pathname: `/designers/${username}/following` }}
          className="navbar-link"
          activeClassName="is-active"
        >
          {`${followingCount || ''} Following`}
        </Link>
      </nav>
    )
  }

  render() {
    const { props, context } = this

    const productsCount = get(props.counters, 'products', 0)

    return (
      <Layout
        className={classNames({
          'user-is-onboarding': (
            context.currentUserIsOnboarding() &&
            productsCount
          )
        })}
      >
        {context.currentUserIsOnboarding() && productsCount ? (
          <CreateSpaceBanner />
        ) : null}

        <div className="user-profile">
          {this.renderHeader()}
          <div className="user-profile-content">
            {props.children}
          </div>
        </div>
      </Layout>
    )
  }
}
