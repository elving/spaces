import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import { default as queryString } from 'query-string'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Designer from '../user/Card'

import toStringId from '../../api/utils/toStringId'

export default class Followers extends Component {
  static propTypes = {
    params: PropTypes.object,
    followers: PropTypes.object,
    emptyMessage: PropTypes.string
  }

  static defaultProps = {
    params: {},
    followers: {},
    emptyMessage: 'No Followers Found...'
  }

  constructor(props) {
    super(props)

    const count = get(props.followers, 'count', 0)
    const results = get(props.followers, 'results', [])

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

    if (isEmpty(props.followers)) {
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
        .get(`/ajax/follows/search/?skip=${state.offset}&${params}`)
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
              'Loading More Followers...'
            ) : (
              'Load More Followers'
            )}
          </span>
        </button>
      </div>
    ) : null
  }

  renderFollowers() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.followers, 'results', []))
    )

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, follow =>
              <Designer
                key={toStringId(follow.createdBy)}
                user={follow.createdBy}
              />
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
        {this.renderFollowers()}
        {this.renderPagination()}
      </div>
    )
  }
}
