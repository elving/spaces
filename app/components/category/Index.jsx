import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Categories from './Categories'

export default class CategoriesIndex extends Component {
  static propTypes = {
    location: PropTypes.object
  }

  static defaultProps = {
    location: {}
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Categories
        </h1>

        <Categories sorting={get(props.location, 'query.sorting')} />
      </Layout>
    )
  }
}
