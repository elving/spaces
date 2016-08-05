import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import { default as queryString } from 'query-string'
import React, { Component, PropTypes } from 'react'

import Space from './Card'
import Loader from '../common/Loader'

import toStringId from '../../api/utils/toStringId'

export default class Spaces extends Component {
  static propTypes = {
    spaces: PropTypes.object,
    params: PropTypes.object,
    emptyMessage: PropTypes.string
  }

  static defaultProps = {
    spaces: {},
    params: {},
    emptyMessage: 'No Spaces Found...'
  }

  constructor(props) {
    super(props)

    const count = get(props, 'spaces.count', 0)
    const results = get(props, 'spaces.results', [])

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

    if (isEmpty(props.spaces)) {
      this.fetch()
    }
  }

  fetch = () => {
    const { props, state } = this

    this.setState({
      isFetching: true
    }, () => {
      const params = !isEmpty(props.params)
        ? queryString.stringify(props.params)
        : ''

      axios
        .get(`/ajax/spaces/search/?skip=${state.offset}&${params}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])

          this.setState({
            offset: state.offset + size(results),
            results: concat(state.results, results),
            isFetching: false,
            hasFetched: true,
            lastResults: results
          })
        })
        .catch(() => {
          this.setState({
            isFetching: false
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
          {state.isFetching ? 'Loading More Spaces...' : 'Load More Spaces'}
        </button>
      </div>
    ) : null
  }

  renderSpaces() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.spaces, 'results', []))
    )

    return (
      <div className="grid">
        <div className="grid-items">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, space =>
              <Space key={toStringId(space)} {...space} />
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
        {this.renderSpaces()}
        {this.renderPagination()}
      </div>
    )
  }
}
