import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import ProductForm from './Form'

export default class UpdateProduct extends Component {
  static propTypes = {
    colors: Type.array,
    brands: Type.array,
    product: Type.object,
    categories: Type.array,
    spaceTypes: Type.array
  };

  render() {
    return (
      <Layout>
        <ProductForm {...this.props} formMethod="PUT"/>
      </Layout>
    )
  }
}
