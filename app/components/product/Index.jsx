import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Products from './Products'

export default class ProductsIndex extends Component {
  static propTypes = {
    products: PropTypes.object
  };

  static defaultProps = {
    products: {}
  };

  render() {
    const { props } = this

    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Products
        </h1>

        <Products products={props.products} />
      </Layout>
    )
  }
}
