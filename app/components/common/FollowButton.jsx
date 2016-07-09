import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import hasFollowed from '../../utils/user/hasFollowed'

export default class FollowButton extends Component {
  static contextTypes = {
    csrf: Type.string,
    user: Type.object,
    userLoggedIn: Type.func
  };

  static propTypes = {
    parent: Type.string,
    showText: Type.bool,
    onFollow: Type.func,
    className: Type.string,
    parentType: Type.string,
    onUnfollow: Type.func,
    hideWhenLoggedOut: Type.bool
  };

  static defaultProps = {
    showText: false,
    onFollow: (() => {}),
    onUnfollow: (() => {}),
    hideWhenLoggedOut: false
  };

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

  onClick() {
    let options = {}
    const { props, state, context } = this
    const createdBy = toStringId(context.user)
    const { parent, parentType } = props

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

    this.setState({ isSaving: true }, () => {
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
        }).catch(() => this.setState({ isSaving: false }))
    })
  }

  render() {
    const { props, state, context } = this

    const btnClassName = classNames({
      button: true,
      [props.className]: !isEmpty(props.className),
      'button--icon': !props.showText,
      'button--small': true,
      'follow-button': true,
      'button--primary': true,
      'follow-button--show-text': props.showText,
      'follow-button--following': state.following
    })

    if (context.userLoggedIn()) {
      return (
        <button
          type="button"
          onClick={::this.onClick}
          disabled={state.isSaving || state.currentUserIsParent}
          className={btnClassName}
        >
          <MaterialDesignIcon name="follow" />
        </button>
      )
    }

    return !props.hideWhenLoggedOut ? (
      <a href="/login/" className={btnClassName}>
        <MaterialDesignIcon name="follow" />
      </a>
    ) : null
  }
}
