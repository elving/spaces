import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import ProductForm from './Form'

export default class UpdateProduct extends Component {
  static propTypes = {
    colors: PropTypes.array,
    brands: PropTypes.array,
    product: PropTypes.object,
    categories: PropTypes.array,
    spaceTypes: PropTypes.array
  }

  render() {
    return (
      <Layout>
        <ProductForm {...this.props} formMethod="PUT" />
      </Layout>
    )
  }
}
