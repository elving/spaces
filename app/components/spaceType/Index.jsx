import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Rooms from './Rooms'
import Layout from '../common/Layout'

export default class SpaceTypesIndex extends Component {
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
        <Rooms sorting={get(props.location, 'query.sorting')} />
      </Layout>
    )
  }
}
