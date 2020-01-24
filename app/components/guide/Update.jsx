import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import GuideForm from './Form'

export default class UpdateGuide extends Component {
  static propTypes = {
    guide: PropTypes.object
  }

  render() {
    return (
      <Layout>
        <GuideForm {...this.props} formMethod="PUT" />
      </Layout>
    )
  }
}
