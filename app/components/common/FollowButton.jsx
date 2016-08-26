import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import hasFollowed from '../../utils/user/hasFollowed'

export default class FollowButton extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    userLoggedIn: PropTypes.func
  }

  static propTypes = {
    parent: PropTypes.string,
    showText: PropTypes.bool,
    onFollow: PropTypes.func,
    className: PropTypes.string,
    parentType: PropTypes.string,
    onUnfollow: PropTypes.func,
    hideWhenLoggedOut: PropTypes.bool
  }

  static defaultProps = {
    showText: true,
    onFollow: (() => {}),
    onUnfollow: (() => {}),
    hideWhenLoggedOut: false
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      isSaving: false,
      following: hasFollowed(context.user, props.parent),
      currentUserIsParent: (
        props.parentType === 'user' &&
        props.parent === get(context, 'user.id')
      )
    }
  }

  onClick = (event) => {
    let options = {}
    const { props, state, context } = this
    const createdBy = toStringId(context.user)
    const { parent, parentType } = props

    event.preventDefault()

    if (state.currentUserIsParent) {
      return false
    }

    if (state.following) {
      options = {
        url: `/ajax/follows/${parentType}/${parent}/${createdBy}/`,
        data: { _csrf: context.csrf },
        method: 'DELETE'
      }
    } else {
      options = {
        url: '/ajax/follows/',
        data: { _csrf: context.csrf, parent, createdBy, parentType },
        method: 'POST'
      }
    }

    this.setState({
      isSaving: true
    }, () => {
      axios(options)
        .then(() => {
          this.setState({
            isSaving: false,
            following: !state.following
          }, () => {
            if (state.following) {
              props.onUnfollow()
            } else {
              props.onFollow()
            }
          })
        })
        .catch(() => {
          this.setState({
            isSaving: false
          })
        })
    })
  }

  render() {
    const { props, state, context } = this

    const btnClassName = classNames({
      button: true,
      'button--icon': !props.showText,
      'button--small': true,
      'follow-button': true,
      'button--primary-outline': true,
      'follow-button--show-text': props.showText,
      'follow-button--following': state.following,
      [props.className]: !isEmpty(props.className)
    })

    if (state.currentUserIsParent) {
      return null
    }

    if (context.userLoggedIn()) {
      return (
        <button
          type="button"
          onClick={this.onClick}
          disabled={state.isSaving}
          className={btnClassName}
        >
          <MaterialDesignIcon name="follow" />
        </button>
      )
    }

    if (!props.hideWhenLoggedOut) {
      return (
        <a href="/login/" className={btnClassName}>
          <MaterialDesignIcon name="follow" />
        </a>
      )
    }

    return null
  }
}
