import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Product from '../product/Card'
import LikesModal from '../modal/Likes'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import MiniProfile from '../user/MiniProfile'
import RedesignPopup from './RedesignPopup'
import CommentsWidget from '../comment/Widget'
import AddProductModal from '../modal/AddProduct'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import AddProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import canModify from '../../utils/user/canModify'
import toStringId from '../../api/utils/toStringId'
import { default as $ } from '../../utils/dom/selector'

class SpaceDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      likesCount: get(props, 'space.likesCount', 0),
      commentsCount: get(props, 'space.commentsCount', 0),
      redesignsCount: get(props, 'space.redesignsCount', 0),
      likesModalIsOpen: false,
      createLikesModal: false,
      sharePopupIsOpen: false,
      sharePopupIsCreated: false,
      redesignPopupIsOpen: false
    }
  }

  static contextTypes = {
    user: PropTypes.object
  };

  static propTypes = {
    space: PropTypes.object,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createaddProductModal: PropTypes.bool
  };

  static defaultProps = {
    space: {},
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createaddProductModal: false
  };

  openRedesignPopup() {
    this.setState({
      redesignPopupIsOpen: true
    })
  }

  closeRedesignPopup() {
    this.setState({
      redesignPopupIsOpen: false
    })
  }

  openSharePopup() {
    this.setState({
      sharePopupIsOpen: true,
      sharePopupIsCreated: true
    })
  }

  closeSharePopup() {
    this.setState({
      sharePopupIsOpen: false
    })
  }

  openLikesModal() {
    this.setState({
      likesModalIsOpen: true,
      createLikesModal: true
    })
  }

  closeLikesModal() {
    this.setState({
      likesModalIsOpen: false
    })
  }

  renderHeader() {
    const name = get(this.props, 'space.name', '')

    return (
      <div className="space-detail-header">
        <h1 className="space-detail-header-title">{name}</h1>
        {this.renderCounters()}
      </div>
    )
  }

  renderCounters() {
    const products = size(get(this.props, 'space.products', []))
    const { likesCount, commentsCount, redesignsCount } = this.state

    return (
      <div className="space-detail-counters">
        {products ? (
          <a
            href="#products"
            className="space-detail-counter"
            data-action="products">
            <div className="space-detail-counter-number">
              {products}
            </div>
            <div className="space-detail-counter-text">
              {inflect(products, 'Product')}
            </div>
          </a>
        ) : null}
        {redesignsCount ? (
          <div
            className="space-detail-counter"
            data-action="redesigns">
            <div className="space-detail-counter-number">
              {redesignsCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(redesignsCount, 'Redesign')}
            </div>
          </div>
        ) : null}
        {likesCount ? (
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              this.openLikesModal()
            }}
            className="space-detail-counter"
            data-action="likes">
            <div className="space-detail-counter-number">
              {likesCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(likesCount, 'Like')}
            </div>
          </a>
        ) : null}
        {commentsCount ? (
          <a
            href="#comments"
            className="space-detail-counter"
            data-action="comments">
            <div className="space-detail-counter-number">
              {commentsCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(commentsCount, 'Comment')}
            </div>
          </a>
        ) : null}
      </div>
    )
  }

  renderSubHeader() {
    return (
      <div className="space-detail-subheader-container">
        <div className="space-detail-subheader">
          {this.renderDesigner()}
          {this.renderActions()}
        </div>
      </div>
    )
  }

  renderDesigner() {
    const createdBy = get(this.props, 'space.createdBy', '')

    return (
      <MiniProfile user={createdBy}/>
    )
  }

  renderSharePopup() {
    const { sharePopupIsOpen, sharePopupIsCreated } = this.state

    const {
      name,
      image,
      products,
      shortUrl,
      detailUrl,
      createdBy
    } = this.props.space

    return sharePopupIsCreated ? (
      <SharePopup
        url={() => `${window.location.origin}/${shortUrl}/`}
        title="Share this space"
        isOpen={sharePopupIsOpen}
        shareUrl={() => `${window.location.origin}/${detailUrl}/`}
        className="share-popup"
        shareText={(
          `${name} — Designed by ${get(createdBy, 'username', '')}, ` +
          `featuring ${size(products)} products.`
        )}
        shareImage={image}
        onClickClose={::this.closeSharePopup}/>
    ) : null
  }

  renderRedesignPopup() {
    const { space } = this.props
    const { redesignPopupIsOpen } = this.state

    return (
      <RedesignPopup
        isOpen={redesignPopupIsOpen}
        spaceId={space.id}
        spaceType={toStringId(space.spaceType)}
        className="redesign-popup"
        onClickClose={::this.closeRedesignPopup}/>
    )
  }

  renderActions() {
    const { user } = this.context
    const { likesCount } = this.state

    return (
      <div className="space-detail-actions">
        <div className="space-detail-action">
          <button
            type="button"
            onClick={::this.openRedesignPopup}
            className={(
              "button button--primary button--small tooltip"
            )}
            data-tooltip="Redesign this space">
            <MaterialDesignIcon name="redesign"/> Redesign
          </button>
          {this.renderRedesignPopup()}
        </div>
        <LikeButton
          parent={get(this.props, 'space.id', '')}
          onLike={() => this.setState({ likesCount: likesCount + 1 })}
          onUnlike={() => this.setState({ likesCount: likesCount - 1 })}
          className="space-detail-action"
          parentType="space"/>
        <div className="space-detail-action">
          <button
            type="button"
            onClick={::this.openSharePopup}
            className={(
              "button button--icon button--small tooltip"
            )}
            data-tooltip="Share this space">
            <MaterialDesignIcon name="send"/>
          </button>
          {this.renderSharePopup()}
        </div>
        <a
          href="#comments"
          onClick={(event) => {
            event.preventDefault()
            $('#comments textarea[name="content"]').focus()
          }}
          className={(
            "space-detail-action button button--icon button--small tooltip"
          )}
          data-tooltip="Comment on this space">
          <MaterialDesignIcon name="comment"/>
        </a>
        {canModify(user, get(this.props, 'space')) ? (
          <button
            type="button"
            className="button button--icon button--small space-detail-action">
            <MaterialDesignIcon name="settings"/>
          </button>
        ) : null}
      </div>
    )
  }

  renderDescription() {
    const description = get(this.props, 'space.description', [])

    return !isEmpty(description) ? (
      <div className="space-detail-description-container">
        <p className="space-detail-description">{description}</p>
      </div>
    ) : null
  }

  renderProducts() {
    const { props } = this

    return (
      <div className="grid">
        <div id="products" className="grid-items">
          {map(get(props, 'space.products', []), product =>
            <Product
              {...product}
              key={toStringId(product)}
              onAddButtonClick={() => props.openAddProductModal(product)}/>
          )}
        </div>
      </div>
    )
  }

  renderLikesModal() {
    const parent = get(this.props, 'space.id')
    const { createLikesModal, likesModalIsOpen } = this.state

    return createLikesModal ? (
      <LikesModal
        parent={parent}
        onClose={::this.closeLikesModal}
        isVisible={likesModalIsOpen}
        parentType="space"/>
    ) : null
  }

  renderComments() {
    const count = get(this.state, 'commentsCount', 0)
    const parent = get(this.props, 'space.id')

    return (
      <div id="comments">
        <CommentsWidget
          parent={parent}
          parentType="space"
          onCommentAdded={() => this.setState({ commentsCount: count + 1 })}
          onCommentRemoved={() => this.setState({ commentsCount: count - 1 })}/>
      </div>
    )
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}/>

        <div className="space-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}
          {this.renderDescription()}
          {this.renderProducts()}
          {this.renderLikesModal()}
          {this.renderComments()}
        </div>
      </Layout>
    )
  }
}

export default AddProductModalContainer(SpaceDetail)
