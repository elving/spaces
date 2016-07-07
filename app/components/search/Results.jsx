import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'
import AddProductModal from '../modal/AddProduct'
import AddProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

class SearchResults extends Component {
  constructor(props) {
    super(props)

    const initialResults = get(props, 'results', [])

    this.state = {
      skip: 40,
      offset: size(initialResults),
      results: initialResults,
      isSearhing: false,
      lastResults: initialResults,
      hasSearched: false
    }
  }

  static propTypes = {
    count: PropTypes.number,
    resuts: PropTypes.array,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createaddProductModal: PropTypes.bool
  };

  static defaultProps = {
    count: 0,
    resuts: [],
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
        .then((res) => {
          const newResults = get(res, 'data', [])

          this.setState({
            offset: state.offset + size(newResults),
            results: concat(state.results, newResults),
            isSearhing: false,
            lastResults: newResults,
            hasSearched: true
          })
        }).catch(() => this.setState({ isSearhing: false }))
    })
  }

  renderPagination() {
    const { props, state } = this
    const resultsSize = size(state.results)

    return (
      resultsSize !== props.count && (
        resultsSize < props.count || !state.hasSearched
      )
    ) ? (
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

  renderResults() {
    const { props, state } = this
    const searchType = get(props.location, 'query.type', '')

    return (
      <div className="grid">
        <div className="grid-items">
          {map(state.results, result => {
            if (isEqual(searchType, 'products')) {
              return (
                <ProductCard
                  {...result}
                  key={toStringId(result)}
                  onAddButtonClick={() => props.openAddProductModal(result)}/>
              )
            } else if (isEqual(searchType, 'spaces')) {
              return (
                <SpaceCard key={toStringId(result)} {...result}/>
              )
            } else if (isEqual(searchType, 'designers')) {
              return (
                <ProfileCard key={toStringId(result)} user={result}/>
              )
            } else {
              return null
            }
          })}
        </div>
      </div>
    )
  }

  render() {
    const { props } = this
    const type = get(props.location, 'query.type', '')
    const searchType = type.substring(0, size(type) - 1)

    return (
      <Layout>
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}/>

        <h1 className="page-title page-title--has-margin">
          {`${props.count} ${inflect(props.count, searchType)} found.`}
        </h1>

        <div className="grids">
          {this.renderResults()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}

export default AddProductModalContainer(SearchResults)
