import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import ProductCard from './Card'
import ProductMiniCard from './MiniCard'

import toStringId from '../../api/utils/toStringId'

export default class RelatedCategories extends Component {
  static propTypes = {
    title: PropTypes.string,
    products: PropTypes.object,
    className: PropTypes.string,
    onAddButtonClick: PropTypes.func
  }

  static defaultProps = {
    products: {
      main: {},
      related: []
    },
    className: '',
    onAddButtonClick: (() => {})
  }

  render() {
    const { props } = this
    const mainProduct = get(props, 'products.main', {})
    const relatedProducts = get(props, 'products.related', [])

    return (
      <div className={`grid-container ${props.className}`}>
        <div className="grid-title-container">
          <h3 className="grid-title">
            {!isEmpty(props.title) ? (
              props.title
            ) : (
              `Related to ${get(mainProduct, 'name')}`
            )}
          </h3>
        </div>
        <div className="grid grid--has-inline">
          <div className="grid-items">
            <ProductCard
              {...mainProduct}
              key={toStringId(mainProduct)}
              onAddButtonClick={() => props.onAddButtonClick(mainProduct)}
            />
            <div
              className={classNames({
                'grid-items': true,
                'grid-items--inline': true,
                'grid-items--less-than-5': size(relatedProducts) <= 4
              })}
            >
              {map(relatedProducts, product =>
                <ProductMiniCard
                  {...product}
                  key={`${toStringId(mainProduct)}-${toStringId(product)}`}
                  onAddButtonClick={() => props.onAddButtonClick(product)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
