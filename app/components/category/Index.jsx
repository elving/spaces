import React, { Component } from 'react'

import Layout from '../common/Layout'
import Categories from './Categories'

export default class CategoriesIndex extends Component {
  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Categories
        </h1>

        <Categories />
      </Layout>
    )
  }
}
