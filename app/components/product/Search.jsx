import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import Product from './Card'
import ProductSearchForm from './SearchForm'

export default class ProductSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      allResults: [],
      lastResults: []
    }

    this.searchForm = null
  }

  static propTypes = {
    brands: Type.array,
    colors: Type.array,
    categories: Type.array,
    spaceTypes: Type.array
  };

  renderResults() {
    const { allResults } = this.state

    return map(allResults, (product) => (
      <Product
        key={get(product, 'id', '')}
        {...product}/>
    ))
  }

  renderPagination() {
    const { allResults, lastResults } = this.state

    return !isEmpty(lastResults) && size(allResults) > 30 ? (
      <div className="products-grid-pagination">
        <button
          onClick={() => this.searchForm.search()}
          className="button">
          Load More
        </button>
      </div>
    ) : null
  }

  render() {
    return (
      <Layout>
        <ProductSearchForm
          ref={(form) => this.searchForm = form}
          onClear={() => this.setState({ allResults: [], lastResults: [] })}
          onSearch={(results) => this.setState(results)}
          {...this.props}/>

        <div className="products-grid">
          <div className="products-grid-items">
            {this.renderResults()}
          </div>
          <div className="products-grid-pagination">
            {this.renderPagination()}
          </div>
        </div>
      </Layout>
    )
  }
}
