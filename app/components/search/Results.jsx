import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'
import AddProductModal from '../modal/AddProduct'
import CreateSpaceBanner from '../onboarding/Banner'
import addProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

class SearchResults extends Component {
  static propTypes = {
    count: PropTypes.number,
    resuts: PropTypes.array,
    location: PropTypes.object,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createAddProductModal: PropTypes.bool
  }

  static defaultProps = {
    count: 0,
    resuts: [],
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createAddProductModal: false
  }

  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

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

  fetch = () => {
    const { props, state } = this
    const params = get(props.location, 'search', '?')

    this.setState({
      isSearhing: true
    }, () => {
      axios
        .get(`/ajax/products/search/${params}&skip=${state.offset}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])

          this.setState({
            offset: state.offset + size(results),
            results: concat(state.results, results),
            isSearhing: false,
            lastResults: results,
            hasSearched: true
          })
        })
        .catch(() => {
          this.setState({
            isSearhing: false
          })
        })
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
          onClick={this.fetch}
          disabled={state.isSearhing}
          className="button button--outline"
        >
          <span className="button-text">
            {state.isSearhing ? 'Loading More...' : 'Load More'}
          </span>
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
            if (searchType === 'products') {
              return (
                <ProductCard
                  {...result}
                  key={toStringId(result)}
                  onAddButtonClick={() => props.openAddProductModal(result)}
                />
              )
            } else if (searchType === 'spaces') {
              return <SpaceCard key={toStringId(result)} {...result} />
            } else if (searchType === 'designers') {
              return <ProfileCard key={toStringId(result)} user={result} />
            }

            return null
          })}
        </div>
      </div>
    )
  }

  render() {
    const { props, context } = this

    const type = get(props.location, 'query.type', '')
    const searchType = type.substring(0, size(type) - 1)

    return (
      <Layout
        className={classNames({
          'user-is-onboarding': context.currentUserIsOnboarding()
        })}
      >
        {context.currentUserIsOnboarding() && searchType === 'products' ? (
          <CreateSpaceBanner />
        ) : null}

        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
        />

        <h1 className="page-title page-title--has-margin">
          {`${props.count} ${inflect(props.count, searchType)} found`}
        </h1>

        <div className="grids">
          {this.renderResults()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}

export default addProductModalContainer(SearchResults)
