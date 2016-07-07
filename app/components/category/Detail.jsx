import map from 'lodash/map'
import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Product from '../product/Card'
import SharePopup from '../common/SharePopup'
import FollowButton from '../common/FollowButton'
import AddProductModal from '../modal/AddProduct'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import SharePopupContainer from '../container/SharePopup'
import AddProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

class CategoryDetail extends Component {
  constructor(props) {
    super(props)

    const results = get(props, 'products.results', [])

    this.state = {
      skip: 40,
      offset: size(results),
      results,
      isSearhing: false,
      lastResults: results,
      followersCount: get(props, 'category.followersCount', 0)
    }
  }

  static propTypes = {
    category: PropTypes.object,
    products: PropTypes.object,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createaddProductModal: PropTypes.bool
  };

  static defaultProps = {
    category: {},
    products: {},
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createaddProductModal: false
  };

  fetch() {
    const { state } = this

    this.setState({ isSearhing: true }, () => {
      axios
        .get(`/ajax/products/search/?skip=${state.offset}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])

          this.setState({
            offset: state.offset + size(results),
            results: concat(state.results, results),
            isSearhing: false,
            lastResults: results
          })
        })
        .catch(() => this.setState({ isSearhing: false }))
    })
  }

  renderPagination() {
    const { props, state } = this

    return size(state.results) < get(props, 'products.count') ? (
      <div className="grid-pagination">
        <button
          onClick={::this.fetch}
          disabled={state.isSearhing}
          className="button button--outline">
          {state.isSearhing ? 'Loading More...' : 'Load More'}
        </button>
      </div>
    ) : null
  }

  renderHeader() {
    const { props } = this

    return (
      <div className="category-detail-header">
        <h1 className="category-detail-header-title">
          {get(props, 'category.name', '')}
        </h1>
      </div>
    )
  }

  renderCounters() {
    const { props, state } = this
    const productsCount = get(props, 'category.productsCount', 0)

    return (
      <div className="category-detail-counters">
        {productsCount ? (
          <a
            href="#products"
            className="category-detail-counter"
            data-action="products">
            <div className="category-detail-counter-number">
              {productsCount}
            </div>
            <div className="category-detail-counter-text">
              {inflect(productsCount, 'Product')}
            </div>
          </a>
        ) : null}
        {state.followersCount ? (
          <div
            className="category-detail-counter"
            data-action="followers">
            <div className="category-detail-counter-number">
              {state.followersCount}
            </div>
            <div className="category-detail-counter-text">
              {inflect(state.followersCount, 'Follower')}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  renderActions() {
    const { props } = this
    const { category } = props

    return (
      <div className="category-detail-actions">
        <FollowButton
          parent={toStringId(category)}
          showText={true}
          className="category-detail-follow-button"
          parentType="category"/>
        <div className="category-detail-action">
          <button
            type="button"
            onClick={props.openSharePopup}
            className={(
              "button button--icon button--small tooltip"
            )}
            data-tooltip="Share this category">
            <MaterialDesignIcon name="send"/>
          </button>
          {props.sharePopupIsCreated ? (
            <SharePopup
              url={() => (
                `${window.location.origin}/${get(category, 'shortUrl')}/`
              )}
              title="Share this category"
              isOpen={props.sharePopupIsOpen}
              shareUrl={() => (
                `${window.location.origin}/${get(category, 'detailUrl')}/`
              )}
              className="share-popup"
              shareText={(
                `${get(category, 'name')} — Designed by ` +
                `${get(category, 'createdBy.username', '')}, ` +
                `featuring ${size(get(category, 'products'))} products.`
              )}
              shareImage={get(category, 'image')}
              onClickClose={props.closeSharePopup}/>
            ) : null}
        </div>
      </div>
    )
  }

  renderSubHeader() {
    return (
      <div className="category-detail-subheader-container">
        <div className="category-detail-subheader">
          {this.renderCounters()}
          {this.renderActions()}
        </div>
      </div>
    )
  }

  renderProducts() {
    const { props, state } = this

    return (
      <div className="grid">
        <div id="products" className="grid-items">
          {map(state.results, product =>
            <Product
              {...product}
              key={toStringId(product)}
              onAddButtonClick={() => props.openAddProductModal(product)}/>
          )}
        </div>
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

        <div className="category-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}
          {this.renderProducts()}
          {this.renderPagination()}
        </div>
      </Layout>
    )
  }
}

export default AddProductModalContainer(
  SharePopupContainer(CategoryDetail)
)
