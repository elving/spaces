import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes as Type } from 'react'

import Space from './Card'
import Layout from '../common/Layout'

import toStringId from '../../api/utils/toStringId'

export default class SpacesIndex extends Component {
  constructor(props) {
    super(props)

    const results = get(props, 'results', [])

    this.state = {
      skip: 40,
      offset: size(results),
      results,
      isSearhing: false,
      lastResults: results
    }
  }

  static propTypes = {
    spaces: Type.array
  };

  static defaultProps = {
    spaces: []
  };

  fetch() {
    const { state } = this

    this.setState({ isSearhing: true }, () => {
      axios
        .get(`/ajax/spaces/search/?skip=${state.offset}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])

          this.setState({
            offset: state.offset + size(results),
            results: concat(state.results, results),
            isSearhing: false,
            lastResults: results
          })
        })
        .catch(() => {
          this.setState({ isSearhing: false })
        })
    })
  }

  renderPagination() {
    const { props, state } = this

    return size(state.results) < props.count ? (
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

  renderSpaces() {
    const { state } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(state.results, space =>
            <Space key={toStringId(space)} {...space}/>
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Spaces
        </h1>

        <div className="grids">
          {this.renderSpaces()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}
