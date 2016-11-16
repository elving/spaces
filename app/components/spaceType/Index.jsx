import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Rooms from './Rooms'
import Layout from '../common/Layout'

export default class SpaceTypesIndex extends Component {
  static propTypes = {
    location: PropTypes.object
  }

  static defaultProps = {
    location: {}
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Rooms
        </h1>

        <Rooms sorting={get(props.location, 'query.sorting')} />
      </Layout>
    )
  }
}
