import ga from 'react-ga'
import { Link } from 'react-router'
import React, { Component, PropTypes as Type } from 'react'

import fullReload from '../../utils/fullReload'

export default class UserProfileLikes extends Component {
  static propTypes = {
    profile: Type.object.isRequired
  };

  render() {
    const { username } = this.props.profile

    return (
      <div className="user-profile-likes">
        <div className="ui-filters">
          <h2 className="ui-filters-title">Likes</h2>
          <div className="ui-filters-options">
            <Link
              to={{pathname: `/users/${username}/likes/spaces`}}
              onClick={(event) => {
                ga.event({
                  label: username,
                  action: 'Clicked Liked Spaces Link',
                  category: 'Profile Likes'
                })

                fullReload(event)
              }}
              className="ui-filters-option"
              activeClassName="is-active">
              Spaces
            </Link>
            <Link
              to={{pathname: `/users/${username}/likes/products`}}
              onClick={(event) => {
                ga.event({
                  label: username,
                  action: 'Clicked Liked Spaces Link',
                  category: 'Profile Likes'
                })

                fullReload(event)
              }}
              className="ui-filters-option"
              activeClassName="is-active">
              Products
            </Link>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}
