import React, { Component } from 'react'

import Layout from '../common/Layout'
import Users from './Users'

export default class UsersIndex extends Component {
  render() {
    return (
      <Layout contentClassName="page-content--padding-top">
        <Users />
      </Layout>
    )
  }
}
