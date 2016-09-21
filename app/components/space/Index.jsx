import React, { Component } from 'react'

import Layout from '../common/Layout'
import Spaces from './Spaces'

export default class SpacesIndex extends Component {
  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Spaces
        </h1>

        <Spaces />
      </Layout>
    )
  }
}
