import React, { Component } from 'react'

import Guides from './Guides'
import Layout from '../common/Layout'

export default class ProductsIndex extends Component {
  render() {
    return (
      <Layout>
        <h1 className="page-title">
          Our shopping guides showcase the
          best spaces and products curated by the community
        </h1>
        <Guides />
      </Layout>
    )
  }
}
