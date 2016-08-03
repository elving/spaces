import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Spaces from './Spaces'

export default class SpacesIndex extends Component {
  static propTypes = {
    spaces: PropTypes.object
  };

  static defaultProps = {
    spaces: {}
  };

  render() {
    const { props } = this

    return (
      <Layout>
        <h1 className="page-title page-title--has-margin">
          Discover Spaces
        </h1>

        <Spaces spaces={props.spaces} />
      </Layout>
    )
  }
}
