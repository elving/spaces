import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import ProfileCard from '../user/Card'

import toStringId from '../../utils/toStringId'

export default class UsersIndex extends Component {
  constructor(props) {
    super(props)

    const users = get(props, 'users', [])

    this.state = {
      skip: 30,
      offset: size(users),
      results: users,
      isSearhing: false,
      lastResults: users,
      hasSearched: false
    }
  }

  static propTypes = {
    users: Type.array
  };

  static defaultProps = {
    users: []
  };

  fetch() {
    const { offset, results } = this.state

    this.setState({ isSearhing: true }, () => {
      axios({ url: `/ajax/users/search/?skip=${offset}` }).then((res) => {
        const users = get(res, 'data', [])

        this.setState({
          offset: offset + size(users),
          results: concat(results, users),
          isSearhing: false,
          lastResults: users,
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

  renderUsers() {
    const { results } = this.state

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(results, (user) => (
            <ProfileCard key={toStringId(user)} user={user}/>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Designers
        </h1>

        <div className="grids">
          {this.renderUsers()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}
