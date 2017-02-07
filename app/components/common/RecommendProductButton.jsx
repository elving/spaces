import React, { Component, PropTypes } from 'react'

import RecommendModal from '../modal/Recommend'
import MaterialDesignIcon from './MaterialDesignIcon'

export default class RecommendProductButton extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func,
    currentUserIsCurator: PropTypes.func
  }

  state = {
    modalIsVisible: false
  }

  closeModal = () => {
    this.setState({
      modalIsVisible: false
    })
  }

  openModal = () => {
    this.setState({
      modalIsVisible: true
    })
  }

  render() {
    const shouldRender = (
      this.context.userLoggedIn() &&
      !this.context.currentUserIsCurator()
    )

    return shouldRender ? (
      <button
        type="button"
        onClick={this.openModal}
        className="add-product-button button button--icon button--primary"
      >
        <span className="button-text">
          <MaterialDesignIcon name="add-alt" size={24} />
        </span>

        <RecommendModal
          onClose={this.closeModal}
          isVisible={this.state.modalIsVisible}
        />
      </button>
    ) : null
  }
}
