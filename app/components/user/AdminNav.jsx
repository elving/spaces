import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger, DropdownContent
} from 'react-simple-dropdown'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CurrentUserNav extends Component {
  static contextTypes = {
    currentUserIsAdmin: PropTypes.func
  }

  render() {
    const { context } = this

    return context.currentUserIsAdmin() ? (
      <div className="admin-nav">
        <Dropdown className="dropdown">
          <DropdownTrigger
            className="dropdown-trigger button button--icon button--outline"
          >
            <MaterialDesignIcon name="build" />
          </DropdownTrigger>
          <DropdownContent className="dropdown-content">
            <a
              href="/admin/guides/"
              className="dropdown-link"
            >
              Manage Guides
            </a>
            <a
              href="/admin/categories/"
              className="dropdown-link"
            >
              Manage Categories
            </a>
            <a
              href="/admin/brands/"
              className="dropdown-link"
            >
              Manage Brands
            </a>
            <a
              href="/admin/colors/"
              className="dropdown-link"
            >
              Manage Colors
            </a>
            <a
              href="/admin/space-types/"
              className="dropdown-link"
            >
              Manage Rooms
            </a>
            <a
              href="/admin/products/"
              className="dropdown-link"
            >
              Manage Products
            </a>
            <a
              href="/admin/products/recommended/"
              className="dropdown-link"
            >
              Manage Recommendations
            </a>
          </DropdownContent>
        </Dropdown>
      </div>
    ) : null
  }
}
