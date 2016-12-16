import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

import hasLiked from '../../utils/user/hasLiked'
import toStringId from '../../api/utils/toStringId'

export default class LikeButton extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    userLoggedIn: PropTypes.func
  }

  static propTypes = {
    size: PropTypes.string,
    onLike: PropTypes.func,
    parent: PropTypes.string,
    isWhite: PropTypes.bool,
    children: PropTypes.node,
    showText: PropTypes.bool,
    onUnlike: PropTypes.func,
    className: PropTypes.string,
    parentType: PropTypes.string,
    showTooltip: PropTypes.bool
  }

  static defaultProps = {
    size: 'small',
    onLike: (() => {}),
    isWhite: false,
    onUnlike: (() => {}),
    showText: false,
    showTooltip: false
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      liked: hasLiked(context.user, props.parent),
      isSaving: false
    }
  }

  onClick = () => {
    const root = '/ajax/likes'
    const { props, state, context } = this
    const createdBy = toStringId(context.user)

    this.setState({
      isSaving: true
    }, () => {
      axios(state.liked ? {
        url: `${root}/${props.parentType}/${props.parent}/${createdBy}/`,
        data: { _csrf: context.csrf },
        method: 'DELETE'
      } : {
        url: `${root}/`,
        data: {
          _csrf: context.csrf,
          parent: props.parent,
          createdBy,
          parentType: props.parentType
        },
        method: 'POST'
      })
      .then(() => {
        this.setState({
          liked: !state.liked,
          isSaving: false
        }, () => {
          if (state.liked) {
            props.onUnlike()
          } else {
            props.onLike()
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
      [props.className]: !isEmpty(props.className),
      tooltip: props.showTooltip,
      'like-button': true,
      'button--icon': !props.showText,
      'button--tiny': props.size === 'tiny',
      'button--small': props.size === 'small',
      'like-button--liked': state.liked,
      'like-button--white': props.isWhite,
      'like-button--show-text': props.showText
    })

    return (
      context.userLoggedIn() ? (
        <button
          type="button"
          onClick={this.onClick}
          disabled={state.isSaving}
          className={btnClassName}
          data-tooltip={
            `${state.liked ? 'Unlike' : 'Like'} this ${props.parentType}`
          }
        >
          <span className="button-text">
            <MaterialDesignIcon name="like" />
            {this.props.children}
          </span>
        </button>
      ) : (
        <a
          href="/login/"
          className={btnClassName}
        >
          <span className="button-text">
            <MaterialDesignIcon name="like" />
            {this.props.children}
          </span>
        </a>
      )
    )
  }
}
