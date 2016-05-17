import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import ColorForm from './Form'

export default class UpdateColor extends Component {
  static propTypes = {
    color: Type.object
  };

  render() {
    const { color } = this.props

    return (
      <Layout>
        <ColorForm color={color} formMethod="PUT"/>
      </Layout>
    )
  }
}
