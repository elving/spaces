import get from 'lodash/get'
import map from 'lodash/map'
import React, { Component, PropTypes } from 'react'

import CategoryCard from './Card'
import ProductMiniCard from '../product/MiniCard'

import toStringId from '../../api/utils/toStringId'

export default class RelatedCategories extends Component {
  static propTypes = {
    categories: PropTypes.object,
    onAddButtonClick: PropTypes.func
  }

  static defaultProps = {
    categories: {
      main: {},
      related: []
    },
    onAddButtonClick: (() => {})
  }

  render() {
    const { props } = this
    const mainCategory = get(props, 'categories.main', {})
    const relatedProducts = get(props, 'categories.related', [])

    return (
      <div className="grid-container">
        <div className="grid-title-container">
          <h3 className="grid-title">
            Popular products related to {get(mainCategory, 'name')}
          </h3>
        </div>
        <div className="grid grid--has-inline">
          <div className="grid-items grid-items--3-cards">
            <CategoryCard
              {...mainCategory}
              key={toStringId(mainCategory)}
            />
            <div className="grid-items grid-items--inline">
              {map(relatedProducts, product =>
                <ProductMiniCard
                  {...product}
                  key={`${toStringId(mainCategory)}-${toStringId(product)}`}
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
