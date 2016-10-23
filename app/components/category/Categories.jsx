import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import { default as queryString } from 'query-string'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Category from './Card'

import toStringId from '../../api/utils/toStringId'
import hasEmptyIdParam from '../../utils/hasEmptyIdParam'

export default class Categories extends Component {
  static propTypes = {
    params: PropTypes.object,
    categories: PropTypes.object,
    emptyMessage: PropTypes.string
  }

  static defaultProps = {
    params: {},
    categories: {},
    emptyMessage: 'No Categories Found...'
  }

  constructor(props) {
    super(props)

    const count = get(props.categories, 'count', 0)
    const results = get(props.categories, 'results', [])

    this.state = {
      skip: 40,
      count,
      offset: size(results),
      results,
      isFetching: isEmpty(results) && !hasEmptyIdParam(props.params),
      hasFetched: !isEmpty(results),
      lastResults: results
    }
  }

  componentDidMount() {
    const { props } = this

    if (isEmpty(props.categories) && !hasEmptyIdParam(props.params)) {
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
        .get(`/ajax/categories/search/?skip=${state.offset}&${params}`)
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
          <span className="button-text">
            {state.isFetching ? (
              'Loading More Categories...'
            ) : (
              'Load More Categories'
            )}
          </span>
        </button>
      </div>
    ) : null
  }

  renderCategories() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.categories, 'results', []))
    )

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, category =>
              <Category {...category} key={toStringId(category)} />
            )
          )}
        </div>
      </div>
    )
  }

  render() {
    const { state } = this

    return state.isFetching && !state.hasFetched ? (
      <div className="grids">
        <Loader size="52" />
      </div>
    ) : (
      <div className="grids">
        {this.renderCategories()}
        {this.renderPagination()}
      </div>
    )
  }
}
