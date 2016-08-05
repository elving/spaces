import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceTypeForm from './Form'

export default class UpdateSpaceType extends Component {
  static propTypes = {
    spaceType: PropTypes.object
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <SpaceTypeForm spaceType={props.spaceType} formMethod="PUT" />
      </Layout>
    )
  }
}
