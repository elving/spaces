import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import CurrentUserAvatar from './CurrentUserAvatar'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CurrentUserNav extends Component {
  static contextTypes = {
    user: PropTypes.object,
    userLoggedIn: PropTypes.func,
    currentUserIsCurator: PropTypes.func
  }

  render() {
    const { context } = this
    const username = get(context.user, 'username')

    return (
      <div className="current-user-nav">
        {context.userLoggedIn() ? (
          <Dropdown className="dropdown">
            <DropdownTrigger className="dropdown-trigger">
              <CurrentUserAvatar />
            </DropdownTrigger>
            <DropdownContent className="dropdown-content">
              <a
                href={`/designers/${username}/`}
                className="dropdown-link"
              >
                Profile <MaterialDesignIcon name="profile" />
              </a>
              {!context.currentUserIsCurator() ? (
                <a
                  href={`/designers/${username}/recommended/`}
                  className="dropdown-link"
                >
                  Recommended <MaterialDesignIcon name="approve" />
                </a>
              ) : null}
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
                'current-user-nav-link button button--primary button--small'
              )}
            >
              <span className="button-text">
                Join Spaces
              </span>
            </a>
          </div>
        )}
      </div>
    )
  }
}
