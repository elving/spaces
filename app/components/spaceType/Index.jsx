import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceTypeCard from './Card'

import toStringId from '../../api/utils/toStringId'

export default class SpaceTypesIndex extends Component {
  static propTypes = {
    count: PropTypes.number,
    results: PropTypes.array
  }

  static defaultProps = {
    count: 0,
    results: []
  }

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

  fetch = () => {
    const { state } = this

    this.setState({
      isSearhing: true
    }, () => {
      axios
        .get(`/ajax/rooms/search/?skip=${state.offset}`)
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
          this.setState({
            isSearhing: false
          })
        })
    })
  }

  renderPagination() {
    const { props, state } = this

    return size(state.results) < props.count ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetch}
          disabled={state.isSearhing}
          className="button button--outline"
        >
          <span className="button-text">
            {state.isSearhing
                ? 'Loading More Rooms...'
                : 'Load More Rooms'
            }
          </span>
        </button>
      </div>
    ) : null
  }

  renderRooms() {
    const { state } = this

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(state.results, room =>
            <SpaceTypeCard key={toStringId(room)} {...room} />
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Rooms
        </h1>

        <div className="grids">
          {this.renderRooms()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}
