import axios from 'axios'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import updateSettings from '../../utils/user/updateSettings'

export default class CreateSpaceBanner extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object
  }

  state = {
    isWaiting: false
  }

  skipOnboarding = (event) => {
    event.preventDefault()

    const { context } = this

    const formData = {
      _csrf: context.csrf,
      settings: updateSettings(context.user, {
        onboarding: false
      })
    }

    const refresh = () => {
      window.location.reload()
    }

    this.setState({
      isWaiting: true
    }, () => {
      axios
      .put(`/ajax/designers/${toStringId(context.user)}/`, formData)
      .then(refresh)
      .catch(refresh)
    })
  }

  renderContent() {
    return (
      <div className="onboarding-message">
        <button
          type="button"
          className="card-action button button--icon"
          data-action="add"
        >
          <MaterialDesignIcon name="add" fill="#2ECC71" />
        </button>
        Create your first space by adding a product.
        {'\u00A0'}
        <a href="/about/">Learn more</a>
        {'\u00A0'}
        or
        {'\u00A0'}
        <a href="#" onClick={this.skipOnboarding}>Skip this.</a>
      </div>
    )
  }

  render() {
    const { state } = this

    return state.isWaiting ? (
      <div className="onboarding-message">
        Skipping...
      </div>
    ) : this.renderContent()
  }
}
