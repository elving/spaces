import get from 'lodash/get'
import map from 'lodash/map'
import React, { Component, PropTypes as Type } from 'react'

import Space from './Card'
import Layout from '../common/Layout'

export default class SpacesIndex extends Component {
  static propTypes = {
    latest: Type.array
  };

  static defaultProps = {
    latest: []
  };

  renderLatest() {
    const { latest } = this.props

    return (
      <div className="grid">
        <div className="grid-items">
          {map(latest, (space) => (
            <Space
              key={get(space, 'id', '')}
              {...space}/>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <h2>Latest</h2>
        {this.renderLatest()}
      </Layout>
    )
  }
}
