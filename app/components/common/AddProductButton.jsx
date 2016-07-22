import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

export default class AddProductButton extends Component {
  static contextTypes = {
    currentUserIsCurator: PropTypes.func
  };

  render() {
    const { context } = this

    return context.currentUserIsCurator() ? (
      <a
        href="/products/add/"
        className="add-product-button button button--icon button--primary"
      >
        <MaterialDesignIcon name="add-alt" size={24} />
      </a>
    ) : null
  }
}
