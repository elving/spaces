import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Space from '../space/Card'
import Loader from '../common/Loader'
import Product from '../product/Card'
import toStringId from '../../api/utils/toStringId'

export default class ProfileLikes extends Component {
  static propTypes = {
    profile: PropTypes.object
  }

  static defaultProps = {
    profile: {}
  }

  constructor(props) {
    super(props)

    this.state = {
      offset: 0,
      results: [],
      isFetching: true,
      hasFetched: false,
      lastResults: []
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

    axios
      .get(`/ajax/likes/user/${toStringId(props.profile)}/`)
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
          {state.isFetching ? 'Loading More Likes...' : 'Load More Likes'}
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
              {`Nothing liked by ${get(props.profile, 'name')} yet...`}
            </p>
          ) : (
            map(state.results, like => {
              const parent = get(like, 'parent', {})

              return like.parentType === 'space' ? (
                <Space key={toStringId(parent)} {...parent} />
              ) : (
                <Product key={toStringId(parent)} {...parent} />
              )
            })
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
