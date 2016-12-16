import React, { Component } from 'react'

import Guides from './Guides'
import Layout from '../common/Layout'

export default class ProductsIndex extends Component {
  render() {
    return (
      <Layout contentClassName="page-content--padding-top">
        <Guides />
      </Layout>
    )
  }
}
