import React, { Component } from 'react'

import Layout from '../common/Layout'
import Designers from './Designers'

export default class UsersIndex extends Component {
  render() {
    return (
      <Layout contentClassName="page-content--padding-top">
        <Designers />
      </Layout>
    )
  }
}
