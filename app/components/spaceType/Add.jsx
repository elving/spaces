import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceTypeForm from './Form'

export default class AddSpaceType extends Component {
  static propTypes = {
    categories: PropTypes.array
  }

  static defaultProps = {
    categories: []
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <SpaceTypeForm categories={props.categories} />
      </Layout>
    )
  }
}
