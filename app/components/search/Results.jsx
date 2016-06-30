import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'

import inflect from '../../utils/inflect'
import toStringId from '../../utils/toStringId'

export default class SearchResults extends Component {
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
    count: Type.number,
    resuts: Type.array
  };

  static defaultProps = {
    count: 0,
    resuts: []
  };

  fetch() {
    const { offset, results } = this.state

    this.setState({ isSearhing: true }, () => {
      axios({ url: `/ajax/products/search/?skip=${offset}` }).then((res) => {
        const newResults = get(res, 'data', [])

        this.setState({
          offset: offset + size(newResults),
          results: concat(results, newResults),
          isSearhing: false,
          lastResults: newResults,
          hasSearched: true
        })
      }).catch(() => {
        this.setState({ isSearhing: false })
      })
    })
  }

  renderPagination() {
    const { count } = this.props
    const { results, isSearhing, hasSearched } = this.state
    const resultsSize = size(results)

    return (
      resultsSize !== count && (
        resultsSize < count ||
        !hasSearched
      )
    ) ? (
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

  renderResults() {
    const { results } = this.state
    const { location } = this.props

    const searchType = get(location, 'query.type', '')

    return (
      <div className="grid">
        <div className="grid-items">
          {map(results, (result) => {
            if (isEqual(searchType, 'products')) {
              return (
                <ProductCard key={toStringId(result)} {...result}/>
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
    const { count, location } = this.props

    const type = get(location, 'query.type', '')
    const searchType = type.substring(0, size(type) - 1)

    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          {`${count} ${inflect(count, searchType)} found.`}
        </h1>

        <div className="grids">
          {this.renderResults()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}
