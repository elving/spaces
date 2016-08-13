import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import { default as queryString } from 'query-string'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Product from './Card'
import AddProductModal from '../modal/AddProduct'
import addProductModalContainer from '../container/AddProductModal'

import toStringId from '../../api/utils/toStringId'

class ProductsIndex extends Component {
  static propTypes = {
    params: PropTypes.object,
    products: PropTypes.object,
    emptyMessage: PropTypes.string,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createAddProductModal: PropTypes.bool
  }

  static defaultProps = {
    params: {},
    products: {},
    emptyMessage: 'No Products Found...',
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createAddProductModal: false
  }

  constructor(props) {
    super(props)

    const count = get(props.products, 'count', 0)
    const results = get(props.products, 'results', [])

    this.state = {
      skip: 40,
      count,
      offset: size(results),
      results,
      isFetching: isEmpty(results),
      hasFetched: !isEmpty(results),
      lastResults: results
    }
  }

  componentDidMount() {
    const { props } = this

    if (isEmpty(props.products)) {
      this.fetch()
    }
  }

  fetch = () => {
    const { props, state } = this

    this.setState({ isFetching: true }, () => {
      const params = !isEmpty(props.params)
        ? queryString.stringify(props.params)
        : ''

      axios
        .get(`/ajax/products/search/?skip=${state.offset}&${params}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])

          this.setState({
            count: get(data, 'count', 0),
            offset: state.offset + size(results),
            results: concat(state.results, results),
            isFetching: false,
            hasFetched: true,
            lastResults: results
          })
        })
        .catch(() => {
          this.setState({
            isWaiting: false
          })
        })
    })
  }

  renderPagination() {
    const { state } = this

    return size(state.results) < state.count ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetch}
          disabled={state.isFetching}
          className="button button--outline"
        >
          {state.isFetching ? 'Loading More Products...' : 'Load More Products'}
        </button>
      </div>
    ) : null
  }

  renderProducts() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.products, 'results', []))
    )

    return (
      <div className="grid">
        <div className="grid-items">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, product =>
              <Product
                {...product}
                key={toStringId(product)}
                onAddButtonClick={() => props.openAddProductModal(product)}
              />
            )
          )}
        </div>
      </div>
    )
  }

  render() {
    const { props, state } = this

    return state.isFetching && !state.hasFetched ? (
      <div className="grids">
        <Loader size="52" />
      </div>
    ) : (
      <div className="grids">
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
        />

        {this.renderProducts()}
        {this.renderPagination()}
      </div>
    )
  }
}

export default addProductModalContainer(ProductsIndex)
