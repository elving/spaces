import map from 'lodash/map'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Space from '../space/Card'
import Layout from '../common/Layout'
import Product from '../product/Card'
import LikeButton from '../common/LikeButton'
import SharePopup from '../common/SharePopup'
import RelatedProducts from '../product/Related'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import addProductModalContainer from '../container/AddProductModal'

import getDate from '../../utils/guide/getDate'
import toStringId from '../../api/utils/toStringId'

class GuideDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    sections: PropTypes.array,
    shortUrl: PropTypes.string,
    detailUrl: PropTypes.string,
    createdAt: PropTypes.date,
    likesCount: PropTypes.number,
    coverImage: PropTypes.string,
    coverSource: PropTypes.string,
    description: PropTypes.string,
    introduction: PropTypes.string
  }

  static defaultProps = {
    sections: [],
    likesCount: 0,
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false
  }

  constructor(props) {
    super(props)

    this.state = {
      likesCount: props.likesCount,
      sharePopupIsOpen: false,
      sharePopupIsCreated: false
    }
  }

  onLike = () => {
    const { state } = this

    this.setState({
      likesCount: state.likesCount + 1
    })
  }

  onUnlike = () => {
    const { state } = this

    this.setState({
      likesCount: state.likesCount - 1
    })
  }

  closeSharePopup = () => {
    this.setState({
      sharePopupIsOpen: false
    })
  }

  openSharePopup = event => {
    event.preventDefault()

    this.setState({
      sharePopupIsOpen: true,
      sharePopupIsCreated: true
    })
  }

  renderSections() {
    const { props } = this
    return map(props.sections, this.renderSection)
  }

  renderSection = section => {
    const { props } = this

    if (section.type === 'grid') {
      return (
        <div className="grid guide-section guide-section-grid">
          <div className="grid-items">
            {map(section.items, item => {
              if (section.modelName === 'Product') {
                return (
                  <Product
                    {...item}
                    key={`${section.type}-${toStringId(item)}`}
                    onAddButtonClick={() => props.openAddProductModal(item)}
                  />
                )
              } else if (section.modelName === 'Space') {
                return (
                  <Space
                    {...item}
                    key={`${section.type}-${toStringId(item)}`}
                  />
                )
              }
            })}
          </div>
        </div>
      )
    } else if (section.type === 'related') {
      if (section.modelName === 'Product') {
        return (
          <RelatedProducts
            title={section.title}
            products={{
              main: section.item,
              related: section.related
            }}
            className="guide-section guide-section-related"
            onAddButtonClick={product => props.openAddProductModal(product)}
          />
        )
      }
    } else if (section.type === 'text') {
      return (
        <div className="guide-section guide-section-text">
          <div className="guide-section-text-inner">
            {section.text}
          </div>
        </div>
      )
    } else if (section.type === 'item-text') {
      return (
        <div className="grid guide-section guide-section-item-text">
          {section.modelName === 'Product' ? (
            <div className="grid-items">
              <Product
                {...section.item}
                key={toStringId(section.item)}
                onAddButtonClick={() => props.openAddProductModal(section.item)}
              />
              <div className="card card-text">
                {section.text}
              </div>
            </div>
          ) : (
            <div className="grid-items">
              <Space
                {...section.item}
                key={toStringId(section.item)}
              />
              <div className="card card-text">
                {section.text}
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  render() {
    const { props, state } = this

    return (
      <Layout className="guide">
        <div
          style={{ backgroundImage: `url(${props.coverImage})` }}
          className="guide-header"
        >
          <a
            href="/guides/"
            className={
              'guide-header-back button button--transparent button--small'
            }
          >
            <span className="button-text">
              <MaterialDesignIcon size={26} name="back" />
              All Guides
            </span>
          </a>
          <div className="guide-header-container">
            <p className="guide-header-date">{getDate(props.createdAt)}</p>
            <h1 className="guide-header-name">{props.name}</h1>
            <h2 className="guide-header-description">{props.description}</h2>
          </div>
          <div className="guide-header-actions">
            <LikeButton
              parent={props.id}
              onLike={this.onLike}
              isWhite
              onUnlike={this.onUnlike}
              className="guide-header-action"
              parentType="guide"
              showTooltip
            >
              {state.likesCount > 0 ? (
                <span style={{ marginLeft: 5 }}>
                  {state.likesCount}
                </span>
              ) : null}
            </LikeButton>
            <button
              type="button"
              onClick={this.openSharePopup}
              className={classNames({
                button: true,
                tooltip: true,
                'share-button': true,
                'button--small': true,
                'guide-header-action': true
              })}
              data-action="send"
              data-tooltip="Share this guide"
            >
              <span className="button-text">
                <MaterialDesignIcon name="send" />
                Share
              </span>
            </button>
            {state.sharePopupIsCreated ? (
              <SharePopup
                url={() => (
                  `${window.location.origin}/${props.detailUrl}/`
                )}
                title="Share this guide"
                isOpen={state.sharePopupIsOpen}
                shareUrl={() => (
                  `${window.location.origin}/${props.shortUrl}/`
                )}
                className="share-popup"
                shareText={props.name}
                onClickClose={this.closeSharePopup}
              />
            ) : null}
          </div>
        </div>

        <div className="guide-sections">
          {this.renderSections()}
        </div>
      </Layout>
    )
  }
}

export default addProductModalContainer(GuideDetail)
