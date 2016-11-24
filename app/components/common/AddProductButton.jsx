import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

export default class AddProductButton extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func
  }

  render() {
    const { context } = this

    return (
      <a
        href={context.userLoggedIn() ? '/products/add/' : '/login/'}
        className="add-product-button button button--icon button--primary"
      >
        <span className="button-text">
          <MaterialDesignIcon name="add-alt" size={24} />
        </span>
      </a>
    )
  }
}
