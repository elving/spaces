import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

import hasLiked from '../../utils/user/hasLiked'

export default class LikeButton extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      liked: hasLiked(get(context, 'user'), get(props, 'parent')),
      isSaving: false
    }
  }

  static contextTypes = {
    csrf: Type.string,
    user: Type.object,
    userLoggedIn: Type.func
  };

  static propTypes = {
    onLike: Type.func,
    parent: Type.string,
    isWhite: Type.bool,
    showText: Type.bool,
    onUnlike: Type.func,
    className: Type.string,
    parentType: Type.string
  };

  static defaultProps = {
    onLike: (() => {}),
    isWhite: false,
    onUnlike: (() => {}),
    showText: false
  };

  onClick() {
    let options = {}
    const { liked } = this.state
    const { csrf, user } = this.context
    const { onLike, parent, onUnlike, parentType } = this.props

    const _csrf = csrf
    const createdBy = get(user, 'id', '')

    if (liked) {
      options = {
        url: `/ajax/likes/${parentType}/${parent}/${createdBy}/`,
        data: { _csrf },
        method: 'DELETE'
      }
    } else {
      options = {
        url: '/ajax/likes/',
        data: { _csrf, parent, createdBy, parentType },
        method: 'POST'
      }
    }

    this.setState({ isSaving: true }, () => {
      axios(options)
        .then(() => {
          this.setState({ liked: !liked, isSaving: false }, () => {
            if (liked) {
              onUnlike()
            } else {
              onLike()
            }
          })
        }).catch(() => {
          this.setState({ isSaving: false })
        })
    })
  }

  render() {
    const { userLoggedIn } = this.context
    const { liked, isSaving } = this.state
    const { isWhite, showText, className, parentType } = this.props

    const btnClassName = classNames({
      'button': true,
      'tooltip': true,
      [className]: !isEmpty(className),
      'like-button': true,
      'button--icon': !showText,
      'button--small': true,
      'like-button--liked': liked,
      'like-button--white': isWhite,
    })

    return (
      userLoggedIn() ? (
        <button
          type="button"
          onClick={::this.onClick}
          disabled={isSaving}
          className={btnClassName}
          data-tooltip={`${liked ? 'Unlike' : 'Like'} this ${parentType}`}>
          <MaterialDesignIcon name="like"/>
          {showText ? (liked ? 'Liked' : 'Like') : null}
        </button>
      ) : (
        <a
          href="/login/"
          className={btnClassName}
          data-tooltip={`${liked ? 'Unlike' : 'Like'} this ${parentType}`}>
          <MaterialDesignIcon name="like"/>
          {showText ? 'Like' : null}
        </a>
      )
    )
  }
}
