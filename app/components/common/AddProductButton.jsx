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
        className="add-product-button button button--primary">
        <MaterialDesignIcon name="add"/>
        Add Product
      </a>
    ) : null
  }
}
