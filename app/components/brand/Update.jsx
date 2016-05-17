import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import BrandForm from './Form'

export default class UpdateBrand extends Component {
  static propTypes = {
    brand: Type.object
  };

  render() {
    const { brand } = this.props

    return (
      <Layout>
        <BrandForm brand={brand} formMethod="PUT"/>
      </Layout>
    )
  }
}
