import map from 'lodash/map'
import join from 'lodash/join'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

import getSuggestionsUrl from '../../utils/space/getSuggestionsUrl'

export default class AddProductCard extends Component {
  static propTypes = {
    message: PropTypes.string,
    categories: PropTypes.array
  }

  static defaultProps = {
    message: '',
    categories: []
  }

  render() {
    const { props } = this

    return (
      <a
        href={getSuggestionsUrl(props.categories)}
        className="card product product-card product-card-add"
      >
        <div className="product-card-add-icon-container">
          <MaterialDesignIcon
            name="check-simple"
            size={110}
            className="product-card-add-icon"
          />
          <span className="product-card-add-message">
            {props.message}
          </span>
        </div>
      </a>
    )
  }
}
