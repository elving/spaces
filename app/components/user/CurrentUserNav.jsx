import get from 'lodash/get'
import React, { Component, PropTypes as Type } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import CurrentUserAvatar from './CurrentUserAvatar'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CurrentUserNav extends Component {
  static contextTypes = {
    user: Type.object,
    userLoggedIn: Type.func
  };

  render() {
    const { user, userLoggedIn } = this.context
    const username = get(user, 'username')

    return (
      <div className="current-user-nav">
        {userLoggedIn() ? (
          <Dropdown className="dropdown">
            <DropdownTrigger className="dropdown-trigger">
              <CurrentUserAvatar />
            </DropdownTrigger>
            <DropdownContent className="dropdown-content">
              <a href={`/users/${username}/`} className="dropdown-link">
                Profile <MaterialDesignIcon name="profile" />
              </a>
              <a href="/logout/" className="dropdown-link">
                Logout <MaterialDesignIcon name="logout" />
              </a>
            </DropdownContent>
          </Dropdown>
        ) : (
          <div className="current-user-nav-cta">
            <a href="/login/" className="current-user-nav-link">
              Login
            </a>
            <a
              href="/join/"
              className={(
                "current-user-nav-link button button--primary button--small"
              )}
            >
              Join Spaces
            </a>
          </div>
        )}
      </div>
    )
  }
}
