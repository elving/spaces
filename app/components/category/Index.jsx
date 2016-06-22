import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import CategoryCard from './Card'

import toStringId from '../../utils/toStringId'

export default class CategoriesIndex extends Component {
  constructor(props) {
    super(props)

    const categories = get(props, 'categories', [])

    this.state = {
      skip: 40,
      offset: size(categories),
      results: categories,
      isSearhing: false,
      lastResults: categories,
      hasSearched: false
    }
  }

  static propTypes = {
    categories: Type.array
  };

  static defaultProps = {
    categories: []
  };

  fetch() {
    const { offset, results } = this.state

    this.setState({ isSearhing: true }, () => {
      axios({ url: `/ajax/categories/search/?skip=${offset}` }).then((res) => {
        const categories = get(res, 'data', [])

        this.setState({
          offset: offset + size(categories),
          results: concat(results, categories),
          isSearhing: false,
          lastResults: categories,
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

  renderCategories() {
    const { results } = this.state

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(results, (category) => (
            <CategoryCard key={toStringId(category)} {...category}/>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Categories
        </h1>

        <div className="grids">
          {this.renderCategories()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}
