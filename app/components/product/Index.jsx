import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Products from './Products'

export default class ProductsIndex extends Component {
  static propTypes = {
    location: PropTypes.object
  }

  static defaultProps = {
    location: {}
  }

  render() {
    const { props } = this

    return (
      <Layout contentClassName="page-content--padding-top">
        <Products sorting={get(props.location, 'query.sorting')} />
      </Layout>
    )
  }
}
