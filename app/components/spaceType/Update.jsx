import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import SpaceTypeForm from './Form'

export default class UpdateSpaceType extends Component {
  static propTypes = {
    spaceType: Type.object
  };

  render() {
    const { spaceType } = this.props

    return (
      <Layout>
        <SpaceTypeForm spaceType={spaceType} formMethod="PUT"/>
      </Layout>
    )
  }
}
