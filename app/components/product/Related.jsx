import get from 'lodash/get'
import map from 'lodash/map'
import React, { Component, PropTypes } from 'react'

import ProductCard from './Card'
import ProductMiniCard from './MiniCard'

import toStringId from '../../api/utils/toStringId'

export default class RelatedCategories extends Component {
  static propTypes = {
    products: PropTypes.object,
    onAddButtonClick: PropTypes.func
  }

  static defaultProps = {
    products: {
      main: {},
      related: []
    },
    onAddButtonClick: (() => {})
  }

  render() {
    const { props } = this
    const mainProduct = get(props, 'products.main', {})
    const relatedProducts = get(props, 'products.related', [])

    return (
      <div className="grid-container">
        <div className="grid-title-container">
          <h3 className="grid-title">
            Related to {get(mainProduct, 'name')}
          </h3>
        </div>
        <div className="grid grid--has-inline">
          <div className="grid-items">
            <ProductCard
              {...mainProduct}
              key={toStringId(mainProduct)}
              onAddButtonClick={() => props.onAddButtonClick(mainProduct)}
            />
            <div className="grid-items grid-items--inline">
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
