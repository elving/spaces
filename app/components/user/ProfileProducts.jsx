import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Products from '../product/Products'
import isCurator from '../../utils/user/isCurator'
import toStringId from '../../api/utils/toStringId'

export default class ProfileProducts extends Component {
  static propTypes = {
    profile: PropTypes.object
  }

  static defaultProps = {
    profile: {}
  }

  render() {
    const { props } = this
    const verb = isCurator(props.profile) ? 'added' : 'recommended'
    const username = get(props.profile, 'name')

    return (
      <Products
        params={{ createdBy: toStringId(props.profile) }}
        emptyMessage={`No products ${verb} by ${username} yet...`}
      />
    )
  }
}
