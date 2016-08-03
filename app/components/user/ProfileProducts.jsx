import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Products from '../product/Products'
import toStringId from '../../api/utils/toStringId'

export default class ProfileProducts extends Component {
  static propTypes = {
    profile: PropTypes.object
  };

  static defaultProps = {
    profile: {}
  };

  render() {
    const { props } = this

    return (
      <Products
        params={{ createdBy: toStringId(props.profile) }}
        emptyMessage={
          `No products added by ${get(props.profile, 'name')} yet...`
        }
      />
    )
  }
}
