import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import ProductForm from './Form'

export default class AddProduct extends Component {
  static propTypes = {
    colors: PropTypes.array,
    brands: PropTypes.array,
    categories: PropTypes.array,
    spaceTypes: PropTypes.array
  }

  render() {
    return (
      <Layout>
        <ProductForm {...this.props} />
      </Layout>
    )
  }
}
