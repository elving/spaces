import map from 'lodash/map'
import join from 'lodash/join'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class AddProductCard extends Component {
  static propTypes = {
    message: PropTypes.string,
    categories: PropTypes.array
  }

  static defaultProps = {
    message: '',
    categories: []
  }

  getSearchUrl() {
    const { props } = this
    const categories = join(map(props.categories, 'id'), '%2C')

    return `/search/?type=products&categories=${categories}`
  }

  render() {
    const { props } = this

    return (
      <a
        href={this.getSearchUrl()}
        className="card product product-card product-card-add"
      >
        <div className="product-card-add-icon-container">
          <MaterialDesignIcon
            name="add-alt"
            size={140}
            className="product-card-add-icon"
          />
          <span className="product-card-add-message">
            {props.message}
          </span>
        </div>
        <div className="product-title card-title-container">
          <div className="card-subtitle card-subtitle--placeholder" />
          <div className="card-title card-title--placeholder" />
        </div>
        <div className="product-tags card-tags">
          <span className="tag tag--small card-tag card-tag--placeholder" />
          <span className="tag tag--small card-tag card-tag--placeholder" />
          <span className="tag tag--small card-tag card-tag--placeholder" />
          <span className="tag tag--small card-tag card-tag--placeholder" />
        </div>
        <div className="product-card-designer">
          <div
            className={classNames({
              'user-avatar': true,
              'product-card-designer-avatar': true,
              'product-card-designer-avatar--placeholder': true
            })}
          />
          <span
            className={classNames({
              'product-card-designer-name': true,
              'product-card-designer-name--placeholder': true
            })}
          />
        </div>
      </a>
    )
  }
}
