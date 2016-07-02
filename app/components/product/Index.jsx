import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import ProductCard from './Card'
import AddProductModal from '../modal/AddProduct'
import AddProductModalContainer from '../container/AddProductModal'

import toStringId from '../../utils/toStringId'

class ProductsIndex extends Component {
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
    count: PropTypes.number,
    results: PropTypes.array,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createaddProductModal: PropTypes.bool
  };

  static defaultProps = {
    count: 0,
    results: [],
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createaddProductModal: false
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
        .catch(() => this.setState({ isSearhing: false }))
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
    const { props, state } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(state.results, product =>
            <ProductCard
              {...product}
              key={toStringId(product)}
              onAddButtonClick={() => props.openAddProductModal(product)}/>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}/>

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

export default AddProductModalContainer(ProductsIndex)
