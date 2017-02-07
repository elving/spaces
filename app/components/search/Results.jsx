import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'
import size from 'lodash/size'
import split from 'lodash/split'
import axios from 'axios'
import concat from 'lodash/concat'
import compact from 'lodash/compact'
import classNames from 'classnames'
import queryString from 'query-string'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import GridCTA from '../cta/GridCTA'
import GuideCard from '../guide/Card'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'
import AddProductModal from '../modal/AddProduct'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import addProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

class SearchResults extends Component {
  static propTypes = {
    count: PropTypes.number,
    results: PropTypes.array,
    filters: PropTypes.object,
    location: PropTypes.object,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createAddProductModal: PropTypes.bool
  }

  static defaultProps = {
    count: 0,
    results: [],
    filters: {},
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createAddProductModal: false
  }

  constructor(props) {
    super(props)

    const initialResults = get(props, 'results', [])

    if (size(initialResults) > 8) {
      initialResults.splice(8, 0, 'cta')
    }

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
          const updatedResults = concat([], state.results, results)

          if (size(updatedResults) > 8 && updatedResults[8] !== 'cta') {
            updatedResults.splice(8, 0, 'cta')
          }

          this.setState({
            offset: state.offset + size(results),
            results: updatedResults,
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

  renderFilters() {
    const { props } = this

    const searchParams = get(props, 'location.search', '')
    const parsedSearchParams = queryString.parse(searchParams)
    const searchType = get(parsedSearchParams, 'type')

    const selectedRooms = split(
      get(parsedSearchParams, 'spaceTypes', ''), ','
    )

    const selectedColors = split(
      get(parsedSearchParams, 'colors', ''), ','
    )

    const selectedCategories = split(
      get(parsedSearchParams, 'categories', ''), ','
    )

    const rooms = map(selectedRooms, room =>
      find(get(props, 'filters.spaceTypes', []), ['id', room])
    )

    const colors = map(selectedColors, color =>
      find(get(props, 'filters.colors', []), ['id', color])
    )

    const categories = map(selectedCategories, category =>
      find(get(props, 'filters.categories', []), ['id', category])
    )

    return (
      <div className="product-finder-filters">
        {map(compact(concat([], rooms, colors, categories)), filter =>
          <a
            key={`filter-${toStringId(filter)}`}
            href={get(filter, 'type') === 'color'
              ? `/search/?type=${searchType}&colors=${toStringId(filter)}`
              : `/${get(filter, 'detailUrl')}/`
            }
            className="product-finder-filter button button--primary-alt"
          >
            <span className="button-text">
              <MaterialDesignIcon name={get(filter, 'type')} />
              {get(filter, 'name')}
            </span>
          </a>
        )}
      </div>
    )
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
        <div
          className={classNames({
            'grid-items': true,
            'grid-items--2-cards': searchType === 'guides'
          })}
        >
          {map(state.results, result => {
            if (result === 'cta') {
              return (
                <GridCTA />
              )
            } else if (searchType === 'guides') {
              return (
                <GuideCard key={toStringId(result)} {...result} />
              )
            } else if (searchType === 'products') {
              return (
                <ProductCard
                  {...result}
                  key={toStringId(result)}
                  onAddButtonClick={() => props.openAddProductModal(result)}
                />
              )
            } else if (searchType === 'spaces') {
              return (
                <SpaceCard key={toStringId(result)} {...result} />
              )
            } else if (searchType === 'users') {
              return (
                <ProfileCard key={toStringId(result)} user={result} />
              )
            }

            return null
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
          isVisible={props.addProductModalIsOpen}
        />

        <h1 className="page-title">
          {`${props.count} ${inflect(props.count, searchType)} found`}
        </h1>

        {this.renderFilters()}

        <div className="grids">
          {this.renderResults()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}

export default addProductModalContainer(SearchResults)
