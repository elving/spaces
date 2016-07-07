import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import hasFollowed from '../../utils/user/hasFollowed'

export default class FollowButton extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      followed: hasFollowed(get(context, 'user'), get(props, 'parent')),
      isSaving: false,
      currentUserIsParent: (
        isEqual(get(props, 'parentType'), 'user') &&
        isEqual(get(props, 'parent'), get(context, 'user.id'))
      )
    }
  }

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

  onClick() {
    let options = {}
    const { csrf, user } = this.context
    const { followed, currentUserIsParent } = this.state
    const { onFollow, parent, onUnfollow, parentType } = this.props

    const _csrf = csrf
    const createdBy = toStringId(user)

    if (currentUserIsParent) {
      return false
    }

    if (followed) {
      options = {
        url: `/ajax/follows/${parentType}/${parent}/${createdBy}/`,
        data: { _csrf },
        method: 'DELETE'
      }
    } else {
      options = {
        url: '/ajax/follows/',
        data: { _csrf, parent, createdBy, parentType },
        method: 'POST'
      }
    }

    this.setState({ isSaving: true }, () => {
      axios(options)
        .then(() => {
          this.setState({ followed: !followed, isSaving: false }, () => {
            if (followed) {
              onUnfollow()
            } else {
              onFollow()
            }
          })
        }).catch(() => {
          this.setState({ isSaving: false })
        })
    })
  }

  render() {
    const { userLoggedIn } = this.context
    const { followed, isSaving, currentUserIsParent } = this.state
    const { showText, className, parentType, hideWhenLoggedOut } = this.props

    const tooltipText = (
      `${followed ? 'Unfollow' : 'Follow'} this ${parentType}`
    )

    const btnClassName = classNames({
      'button': true,
      'tooltip': true,
      [className]: !isEmpty(className),
      'button--icon': !showText,
      'button--small': true,
      'follow-button': true,
      'button--primary': true,
      'follow-button--followed': followed
    })

    return userLoggedIn() ? (
      <button
        type="button"
        onClick={::this.onClick}
        disabled={isSaving || currentUserIsParent}
        className={btnClassName}
        data-tooltip={tooltipText}>
        <MaterialDesignIcon name={followed ? 'unfollow' : 'follow'}/>
        {showText ? (followed ? 'Followed' : 'Follow') : null}
      </button>
    ) : (
      !hideWhenLoggedOut ? (
        <a
          href="/login/"
          className={btnClassName}
          data-tooltip={tooltipText}>
          <MaterialDesignIcon name={followed ? 'unfollow' : 'follow'}/>
          {showText ? (followed ? 'Followed' : 'Follow') : null}
        </a>
      ) : null
    )
  }
}
