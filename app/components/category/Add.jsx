import React, { Component } from 'react'

import Layout from '../common/Layout'
import CategoryForm from './Form'

export default class AddCategory extends Component {
  render() {
    return (
      <Layout>
        <CategoryForm />
      </Layout>
    )
  }
}
