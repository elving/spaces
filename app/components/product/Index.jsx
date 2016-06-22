import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import ProductCard from './Card'

import toStringId from '../../utils/toStringId'

export default class ProductsIndex extends Component {
  constructor(props) {
    super(props)

    const products = get(props, 'products', [])

    this.state = {
      skip: 40,
      offset: size(products),
      results: products,
      isSearhing: false,
      lastResults: products,
      hasSearched: false
    }
  }

  static propTypes = {
    products: Type.array
  };

  static defaultProps = {
    products: []
  };

  fetch() {
    const { offset, results } = this.state

    this.setState({ isSearhing: true }, () => {
      axios({ url: `/ajax/products/search/?skip=${offset}` }).then((res) => {
        const products = get(res, 'data', [])

        this.setState({
          offset: offset + size(products),
          results: concat(results, products),
          isSearhing: false,
          lastResults: products,
          hasSearched: true
        })
      }).catch(() => {
        this.setState({ isSearhing: false })
      })
    })
  }

  renderPagination() {
    const { skip, isSearhing, lastResults, hasSearched } = this.state

    return size(lastResults) >= skip || !hasSearched ? (
      <div className="grid-pagination">
        <button
          onClick={::this.fetch}
          disabled={isSearhing}
          className="button button--outline">
          {isSearhing ? 'Loading More...' : 'Load More'}
        </button>
      </div>
    ) : null
  }

  renderProducts() {
    const { results } = this.state

    return (
      <div className="grid">
        <div className="grid-items">
          {map(results, (product) => (
            <ProductCard key={toStringId(product)} {...product}/>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Products
        </h1>

        <div className="grids">
          {this.renderProducts()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}
