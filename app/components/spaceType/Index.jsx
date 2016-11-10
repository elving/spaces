import React, { Component } from 'react'

import Rooms from './Rooms'
import Layout from '../common/Layout'

export default class SpaceTypesIndex extends Component {
  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Rooms
        </h1>

        <Rooms />
      </Layout>
    )
  }
}
