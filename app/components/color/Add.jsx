import React, { Component } from 'react'

import Layout from '../common/Layout'
import ColorForm from './Form'

export default class AddColor extends Component {
  render() {
    return (
      <Layout>
        <ColorForm />
      </Layout>
    )
  }
}
