import get from 'lodash/get'
import axios from 'axios'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

import $ from '../../utils/dom/selector'
import toStringId from '../../api/utils/toStringId'
import getPosition from '../../utils/dom/getPosition'
import updateSettings from '../../utils/user/updateSettings'

export default class OnboardingTips extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    currentUserIsOnboarding: PropTypes.func
  }

  state = {
    isVisible: false,
    currentTip: 'design'
  }

  componentDidMount() {
    this.startOnboarding()
  }

  getTipPosition = (tip) => {
    let position

    if (tip === 'design') {
      position = getPosition($('.product [data-action="add"]', true)[0])
    } else if (tip === 'like') {
      position = getPosition($('.product .like-button', true)[0])
    } else if (tip === 'share') {
      position = getPosition($('.product .share-button', true)[0])
    } else if (tip === 'recommend') {
      position = getPosition($('.header .add-product-button'))
    }

    return {
      top: get(position, 'top', 0),
      left: get(position, 'left', 0)
    }
  }

  startOnboarding() {
    const { state } = this

    document.body.setAttribute('data-onboarding', state.currentTip)
    document.body.classList.add('user-is-onboarding')

    setTimeout(() => {
      window.scrollTo(0, 0)

      this.setState({
        isVisible: true
      })
    }, 0)
  }

  endOnboarding = () => {
    const { context } = this

    axios.put(`/ajax/designers/${toStringId(context.user)}/`, {
      _csrf: context.csrf,
      settings: updateSettings(context.user, {
        onboarding: false
      })
    })
  }

  goToNextTip = () => {
    const { state } = this

    let nextTip

    window.scrollTo(0, 0)

    if (state.currentTip === 'design') {
      nextTip = 'like'
    } else if (state.currentTip === 'like') {
      nextTip = 'share'
    } else if (state.currentTip === 'share') {
      nextTip = 'recommend'
    } else {
      nextTip = 'design'
    }

    document.body.setAttribute('data-onboarding', nextTip)

    if (state.currentTip === 'share') {
      this.endOnboarding()
    } else if (state.currentTip === 'recommend') {
      document.body.removeAttribute('data-onboarding')
      document.body.classList.remove('user-is-onboarding')

      return this.setState({
        isVisible: false
      })
    }

    setTimeout(() => {
      this.setState({
        currentTip: nextTip
      })
    }, 0)
  }

  renderButton = type => {
    switch (type) {
      case 'design': {
        return (
          <button
            type="button"
            className="card-action button button--icon button--small"
            data-action="add"
          >
            <MaterialDesignIcon name="check-simple" fill="#2ECC71" />
          </button>
        )
      }

      case 'like': {
        return (
          <button
            type="button"
            className={classNames({
              button: true,
              'card-action': true,
              'like-button': true,
              'button--icon': true,
              'button--small': true,
              'like-button--white': true
            })}
          >
            <MaterialDesignIcon name="like" />
          </button>
        )
      }

      case 'share': {
        return (
          <button
            type="button"
            className="card-action share-button button button--icon"
            data-action="send"
          >
            <MaterialDesignIcon name="send" />
          </button>
        )
      }

      case 'recommend': {
        return (
          <button
            type="button"
            className="button button--icon button--primary button--small"
            data-action="add"
          >
            <MaterialDesignIcon name="add-alt" fill="#2ECC71" />
          </button>
        )
      }

      default: {
        return null
      }
    }
  }

  renderInfoLink = (tip) => {
    let url

    if (tip === 'design') {
      url = '/about/#creating-spaces'
    } else if (tip === 'like') {
      url = '/about/#following-and-liking'
    } else if (tip === 'share') {
      return null
    } else if (tip === 'recommend') {
      url = '/about/#curating-products'
    }

    return (
      <a href={url}>
        Learn More
        <MaterialDesignIcon name="help" size={15} />
      </a>
    )
  }

  renderTip() {
    const { state } = this

    const position = this.getTipPosition(state.currentTip)

    switch (state.currentTip) {
      case 'design': {
        return (
          <div
            style={{
              top: position.top + 56,
              left: position.left
            }}
            data-tip="design"
            className="onboarding-tip"
          >
            <small className="onboarding-tip-header">
              Tip 1 of 4
              {this.renderInfoLink('design')}
            </small>
            <div className="onboarding-tip-content">
              Click {this.renderButton('design')} to
              design a space with this product.
            </div>
            <div className="onboarding-tip-actions">
              <button
                type="button"
                onClick={this.goToNextTip}
                className={classNames({
                  button: true,
                  'button--small': true,
                  'button--primary-alt': true,
                  'onboarding-tip-action': true
                })}
              >
                Next
              </button>
            </div>
          </div>
        )
      }

      case 'like': {
        return (
          <div
            style={{
              top: position.top + 56,
              left: position.left
            }}
            data-tip="like"
            className="onboarding-tip"
          >
            <small className="onboarding-tip-header">
              Tip 2 of 4
              {this.renderInfoLink('like')}
            </small>
            <div className="onboarding-tip-content">
              Click {this.renderButton('like')} to
              save products and spaces you love to your profile.
            </div>
            <div className="onboarding-tip-actions">
              <button
                type="button"
                onClick={this.goToNextTip}
                className={classNames({
                  button: true,
                  'button--small': true,
                  'button--primary-alt': true,
                  'onboarding-tip-action': true
                })}
              >
                Next
              </button>
            </div>
          </div>
        )
      }

      case 'share': {
        return (
          <div
            style={{
              top: position.top + 56,
              left: position.left
            }}
            data-tip="share"
            className="onboarding-tip"
          >
            <small className="onboarding-tip-header">
              Tip 3 of 4
              {this.renderInfoLink('share')}
            </small>
            <div className="onboarding-tip-content">
              Click {this.renderButton('share')} to
              share products and spaces with your friends.
            </div>
            <div className="onboarding-tip-actions">
              <button
                type="button"
                onClick={this.goToNextTip}
                className={classNames({
                  button: true,
                  'button--small': true,
                  'button--primary-alt': true,
                  'onboarding-tip-action': true
                })}
              >
                Next
              </button>
            </div>
          </div>
        )
      }

      case 'recommend': {
        return (
          <div
            style={{
              top: position.top + 62,
              left: position.left - 276
            }}
            data-tip="recommend"
            className="onboarding-tip"
          >
            <small className="onboarding-tip-header">
              Tip 4 of 4
              {this.renderInfoLink('recommend')}
            </small>
            <div className="onboarding-tip-content">
              Click {this.renderButton('recommend')} to
              recommend products you like and are exited about.
            </div>
            <div className="onboarding-tip-actions">
              <button
                type="button"
                onClick={this.goToNextTip}
                className={classNames({
                  button: true,
                  'button--small': true,
                  'button--primary-alt': true,
                  'onboarding-tip-action': true
                })}
              >
                Got it!
              </button>
            </div>
          </div>
        )
      }

      default: {
        return (
          <div className="onboarding-tip">
            Tip
          </div>
        )
      }
    }
  }

  render() {
    const { state, context } = this

    return state.isVisible && context.currentUserIsOnboarding() ? (
      <div className="onboarding-tips">
        <div className="onboarding-tips-backdrop" />
        {this.renderTip()}
      </div>
    ) : null
  }
}
