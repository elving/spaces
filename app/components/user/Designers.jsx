import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import { default as queryString } from 'query-string'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Designer from './Card'
import MiniProfile from './MiniProfile'

import toStringId from '../../api/utils/toStringId'
import hasEmptyIdParam from '../../utils/hasEmptyIdParam'

export default class Designers extends Component {
  static propTypes = {
    params: PropTypes.object,
    designers: PropTypes.object,
    emptyMessage: PropTypes.string,
    displayMiniProfile: PropTypes.bool
  }

  static defaultProps = {
    params: {},
    designers: {},
    emptyMessage: 'No Designers Found...',
    displayMiniProfile: false
  }

  constructor(props) {
    super(props)

    const count = get(props.designers, 'count', 0)
    const results = get(props.designers, 'results', [])

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

    if (isEmpty(props.designers) && !hasEmptyIdParam(props.params)) {
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
        .get(`/ajax/designers/search/?skip=${state.offset}&${params}`)
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
              'Loading More Designers...'
            ) : (
              'Load More Designers'
            )}
          </span>
        </button>
      </div>
    ) : null
  }

  renderDesigners() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.designers, 'results', []))
    )

    return (
      <div className="grid">
        <div
          className={classNames({
            'grid-items': true,
            'grid-items--3-cards': !props.displayMiniProfile
          })}
        >
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, designer => (
              props.displayMiniProfile ? (
                <MiniProfile
                  key={toStringId(designer)}
                  user={designer}
                />
              ) : (
                <Designer
                  key={toStringId(designer)}
                  user={designer}
                />
              )
            ))
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
        {this.renderDesigners()}
        {this.renderPagination()}
      </div>
    )
  }
}
