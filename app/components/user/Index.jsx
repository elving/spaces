import React, { Component } from 'react'

import Layout from '../common/Layout'
import Designers from './Designers'

export default class UsersIndex extends Component {
  render() {
    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Designers
        </h1>

        <Designers />
      </Layout>
    )
  }
}
