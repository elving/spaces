import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import CategoryForm from './Form'

export default class UpdateCategory extends Component {
  static propTypes = {
    category: Type.object
  };

  render() {
    const { category } = this.props

    return (
      <Layout>
        <CategoryForm category={category} formMethod="PUT"/>
      </Layout>
    )
  }
}
