import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

export default class AddProductButton extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func,
    currentUserIsCurator: PropTypes.func
  }

  render() {
    const { context } = this
    const url = context.currentUserIsCurator()
      ? '/products/add/'
      : '/products/recommend/'

    return (
      <a
        href={context.userLoggedIn() ? url : '/login/'}
        className="add-product-button button button--icon button--primary"
      >
        <span className="button-text">
          <MaterialDesignIcon name="add-alt" size={24} />
        </span>
      </a>
    )
  }
}
