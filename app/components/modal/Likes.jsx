import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import Modal from 'react-modal'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import MiniProfile from '../user/MiniProfile'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

const overrideDefaultStyles = {
  overlay: { backgroundColor: null },
  content: {
    top: 'initial',
    left: 'initial',
    right: 'initial',
    bottom: 'initial',
    border: null,
    padding: null,
    position: null,
    background: null,
    borderRadius: null
  }
}

export default class LikesModal extends Component {
  static propTypes = {
    parent: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    parentType: PropTypes.string.isRequired
  }

  static defaultProps = {
    onClose: (() => {}),
    isVisible: false
  }

  state = {
    likes: [],
    isLoadingLikes: true
  }

  componentDidMount() {
    this.fetch()
  }

  componentWillReceiveProps(nextProps) {
    const { state } = this

    if (nextProps.isVisible && !state.isLoadingLikes) {
      this.fetch()
    }
  }

  onCloseClick = () => {
    const { props } = this

    document.body.classList.remove('ReactModal__Body--open')
    document.querySelector('html').classList.remove(
      'ReactModal__Body--open'
    )

    props.onClose()
  }

  fetch() {
    const { props } = this

    axios
      .get(`/ajax/likes/${props.parentType}/${props.parent}/`)
      .then(({ data }) => {
        this.setState({
          likes: get(data, 'likes', []),
          isLoadingLikes: false
        })
      })
      .catch(() => {
        this.setState({
          likes: [],
          isLoadingLikes: false
        })
      })
  }

  renderLike = (like) => (
    <li
      key={`likes-user-${toStringId(like.createdBy)}`}
      className="likes-modal-user"
    >
      <MiniProfile user={like.createdBy} />
    </li>
  )

  renderContent() {
    const { state } = this

    if (state.isLoadingLikes) {
      return this.renderLoadingState()
    } else if (isEmpty(state.likes)) {
      return this.renderEmptyState()
    }

    return this.renderLikes()
  }

  renderLoadingState() {
    return (
      <section className="likes-modal-inner">
        {this.renderCloseButton()}
        <Loader size={55} />
      </section>
    )
  }

  renderEmptyState() {
    const { props } = this

    return (
      <section className="likes-modal-inner">
        {this.renderCloseButton()}
        <h1 className="likes-modal-title">
          {`This ${props.parentType} hasn't been liked yet.`}
        </h1>
      </section>
    )
  }

  renderLikes() {
    const { props, state } = this

    const count = size(state.likes)
    const countTerm = size(state.likes) === 1
      ? 'person'
      : 'people'

    return (
      <section
        className="likes-modal-inner likes-modal-inner--has-likes"
        data-type={props.parentType}
      >
        {this.renderCloseButton()}
        <h1 className="likes-modal-title">
          {`Liked by ${count} ${countTerm}`}
        </h1>
        <ul className="likes-modal-list">
          {map(state.likes, this.renderLike)}
        </ul>
      </section>
    )
  }

  renderCloseButton() {
    return (
      <button
        type="button"
        onClick={this.onCloseClick}
        className="likes-modal-close button button--icon button--transparent"
      >
        <MaterialDesignIcon name="close" />
      </button>
    )
  }

  render() {
    const { props } = this

    return (
      <Modal
        style={overrideDefaultStyles}
        isOpen={props.isVisible}
        className="modal likes-modal"
        onAfterOpen={() => {
          document.body.classList.add('ReactModal__Body--open')
          document.querySelector('html').classList.add('ReactModal__Body--open')
        }}
        contentLabel="Modal"
        onRequestClose={this.onCloseClick}
      >
        {this.renderContent()}
      </Modal>
    )
  }
}
