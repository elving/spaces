import React, { Component, PropTypes as Type } from 'react'

import Dropdown, {
  DropdownTrigger, DropdownContent
} from 'react-simple-dropdown'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CurrentUserNav extends Component {
  static contextTypes = {
    currentUserIsAdmin: Type.func
  };

  render() {
    const { currentUserIsAdmin } = this.context

    return currentUserIsAdmin() ? (
      <div className="admin-nav">
        <Dropdown className="dropdown">
          <DropdownTrigger
            className="dropdown-trigger button button--outline">
            <MaterialDesignIcon name="settings"/> Admin
          </DropdownTrigger>
          <DropdownContent className="dropdown-content">
            <a
              href="/admin/categories/"
              className="dropdown-link">
              Manage Categories
            </a>
            <a
              href="/admin/brands/"
              className="dropdown-link">
              Manage Brands
            </a>
            <a
              href="/admin/colors/"
              className="dropdown-link">
              Manage Colors
            </a>
            <a
              href="/admin/space-types/"
              className="dropdown-link">
              Manage Space Types
            </a>
            <a
              href="/admin/products/"
              className="dropdown-link">
              Manage Products
            </a>
          </DropdownContent>
        </Dropdown>
      </div>
    ) : null
  }
}
