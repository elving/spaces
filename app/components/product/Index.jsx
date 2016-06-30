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

    const results = get(props, 'results', [])

    this.state = {
      skip: 40,
      offset: size(results),
      results,
      isSearhing: false,
      lastResults: results
    }
  }

  static propTypes = {
    count: Type.number,
    results: Type.array
  };

  static defaultProps = {
    count: 0,
    results: []
  };

  fetch() {
    const { state } = this

    this.setState({ isSearhing: true }, () => {
      axios
        .get(`/ajax/products/search/?skip=${state.offset}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])

          this.setState({
            offset: state.offset + size(results),
            results: concat(state.results, results),
            isSearhing: false,
            lastResults: results
          })
        })
        .catch(() => {
          this.setState({ isSearhing: false })
        })
    })
  }

  renderPagination() {
    const { props, state } = this

    return size(state.results) < props.count ? (
      <div className="grid-pagination">
        <button
          onClick={::this.fetch}
          disabled={state.isSearhing}
          className="button button--outline">
          {state.isSearhing ? 'Loading More...' : 'Load More'}
        </button>
      </div>
    ) : null
  }

  renderProducts() {
    const { state } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(state.results, product =>
            <ProductCard key={toStringId(product)} {...product}/>
          )}
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
