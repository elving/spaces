import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import Spaces from '../space/Spaces'
import toStringId from '../../api/utils/toStringId'

export default class ProfileSpaces extends Component {
  static propTypes = {
    profile: PropTypes.object
  };

  static defaultProps = {
    profile: {}
  };

  render() {
    const { props } = this

    return (
      <Spaces
        params={{ createdBy: toStringId(props.profile) }}
        emptyMessage={
          `No spaces designed by ${get(props.profile, 'name')} yet...`
        }
      />
    )
  }
}
