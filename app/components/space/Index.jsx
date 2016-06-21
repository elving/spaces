import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes as Type } from 'react'

import Space from './Card'
import Layout from '../common/Layout'

import toStringId from '../../utils/toStringId'

export default class SpacesIndex extends Component {
  constructor(props) {
    super(props)

    const spaces = get(props, 'spaces', [])

    this.state = {
      skip: 30,
      offset: size(spaces),
      results: spaces,
      isSearhing: false,
      lastResults: spaces,
      hasSearched: false
    }
  }

  static propTypes = {
    spaces: Type.array
  };

  static defaultProps = {
    spaces: []
  };

  fetch() {
    const { offset, results } = this.state

    this.setState({ isSearhing: true }, () => {
      axios({ url: `/ajax/spaces/search/?skip=${offset}` }).then((res) => {
        const spaces = get(res, 'data', [])

        this.setState({
          offset: offset + size(spaces),
          results: concat(results, spaces),
          isSearhing: false,
          lastResults: spaces,
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

  renderSpaces() {
    const { results } = this.state

    return (
      <div className="grid">
        <div className="grid-items">
          {map(results, (space) => (
            <Space key={toStringId(space)} {...space}/>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <div className="grids">
          <div className="grid-container">
            <h3 className="grid-title">Latest Spaces</h3>
            {this.renderSpaces()}
            {this.renderPagination()}
          </div>
        </div>
      </Layout>
    )
  }
}
