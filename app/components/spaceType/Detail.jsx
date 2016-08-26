import map from 'lodash/map'
import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Space from '../space/Card'
import Layout from '../common/Layout'
import Product from '../product/Card'
import SharePopup from '../common/SharePopup'
import FollowButton from '../common/FollowButton'
import AddProductModal from '../modal/AddProduct'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import sharePopupContainer from '../container/SharePopup'
import addProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

class SpaceTypeDetail extends Component {
  static propTypes = {
    spaces: PropTypes.object,
    products: PropTypes.object,
    spaceType: PropTypes.object,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createAddProductModal: PropTypes.bool
  }

  static defaultProps = {
    spaces: {},
    products: {},
    spaceType: {},
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createAddProductModal: false
  }

  constructor(props) {
    super(props)

    const spacesResults = get(props, 'spaces.results', [])
    const productsResults = get(props, 'products.results', [])

    this.state = {
      skip: 40,
      spacesOffset: size(spacesResults),
      spacesResults,
      productsOffset: size(productsResults),
      followersCount: get(props, 'spaceType.followersCount', 0),
      productsResults,
      isSearhingSpaces: false,
      lastSpacesResults: spacesResults,
      isSearhingProducts: false,
      lastProductsResults: productsResults
    }
  }

  getShortUrl = () => {
    const { props } = this
    const spaceTypeShortUrl = get(props.spaceType, 'shortUrl')
    return `${window.location.origin}/${spaceTypeShortUrl}/`
  }

  getDetailUrl = () => {
    const { props } = this
    const spaceTypeDetailUrl = get(props.spaceType, 'detailUrl')
    return `${window.location.origin}/${spaceTypeDetailUrl}/`
  }

  fetchSpaces = () => {
    const { props, state } = this

    this.setState({
      isSearhingSpaces: true
    }, () => {
      axios
        .get(`/ajax/spaces/search/?skip=${state.spacesOffset}`, {
          params: { spaceType: toStringId(props.spaceType) }
        })
        .then(({ data }) => {
          const spacesResults = get(data, 'results', [])

          this.setState({
            spacesOffset: state.spacesOffset + size(spacesResults),
            spacesResults: concat(state.spacesResults, spacesResults),
            isSearhingSpaces: false,
            lastSpacesResults: spacesResults
          })
        })
        .catch(() => this.setState({ isSearhingSpaces: false }))
    })
  }

  fetchProducts = () => {
    const { props, state } = this

    this.setState({
      isSearhingProducts: true
    }, () => {
      axios
        .get(`/ajax/products/search/?skip=${state.productsOffset}`, {
          params: { spaceTypes: toStringId(props.spaceType) }
        })
        .then(({ data }) => {
          const productsResults = get(data, 'results', [])

          this.setState({
            productsOffset: state.productsOffset + size(productsResults),
            productsResults: concat(state.productsResults, productsResults),
            isSearhingProducts: false,
            lastProductsResults: productsResults
          })
        })
        .catch(() => this.setState({ isSearhingProducts: false }))
    })
  }

  renderHeader() {
    const { props } = this

    return (
      <div className="spaceType-detail-header">
        <h1 className="spaceType-detail-header-title">
          {get(props, 'spaceType.name', '')}
        </h1>
      </div>
    )
  }

  renderCounters() {
    const { props, state } = this
    const spacesCount = get(props, 'spaceType.spacesCount', 0)
    const productsCount = get(props, 'spaceType.productsCount', 0)

    return (
      <div className="spaceType-detail-counters">
        {spacesCount ? (
          <a href="#spaces" className="spaceType-detail-counter">
            <div className="spaceType-detail-counter-number">
              {spacesCount}
            </div>
            <div className="spaceType-detail-counter-text">
              {inflect(spacesCount, 'Space')}
            </div>
          </a>
        ) : null}
        {productsCount ? (
          <a href="#products" className="spaceType-detail-counter">
            <div className="spaceType-detail-counter-number">
              {productsCount}
            </div>
            <div className="spaceType-detail-counter-text">
              {inflect(productsCount, 'Product')}
            </div>
          </a>
        ) : null}
        {state.followersCount ? (
          <div
            className="spaceType-detail-counter"
            data-action="followers"
          >
            <div className="spaceType-detail-counter-number">
              {state.followersCount}
            </div>
            <div className="spaceType-detail-counter-text">
              {inflect(state.followersCount, 'Follower')}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  renderActions() {
    const { props } = this
    const spaceTypeName = get(props.spaceType, 'name')
    const spaceTypeImage = get(props.spaceType, 'image')
    const spaceTypeProductsCount = get(props.spaceType, 'productsCount')

    return (
      <div className="spaceType-detail-actions">
        <FollowButton
          parent={toStringId(props.spaceType)}
          className="spaceType-detail-follow-button"
          parentType="spaceType"
        />
        <div className="spaceType-detail-action">
          <button
            type="button"
            onClick={props.openSharePopup}
            className={(
              "button share-button button--icon button--small"
            )}
          >
            <MaterialDesignIcon name="send" />
          </button>
          {props.sharePopupIsCreated ? (
            <SharePopup
              url={this.getShortUrl}
              title="Share this spaceType"
              isOpen={props.sharePopupIsOpen}
              shareUrl={this.getDetailUrl}
              className="share-popup"
              shareText={(
                `${spaceTypeName} — ` +
                `Featuring ${spaceTypeProductsCount} ` +
                `${inflect(spaceTypeProductsCount, 'product')}.`
              )}
              shareImage={spaceTypeImage}
              onClickClose={props.closeSharePopup}
            />
            ) : null}
        </div>
      </div>
    )
  }

  renderSubHeader() {
    return (
      <div className="spaceType-detail-subheader-container">
        <div className="spaceType-detail-subheader">
          {this.renderCounters()}
          {this.renderActions()}
        </div>
      </div>
    )
  }

  renderSpaces() {
    const { state } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(state.spacesResults, space =>
            <Space {...space} key={toStringId(space)} />
          )}
        </div>
      </div>
    )
  }

  renderProducts() {
    const { props, state } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(state.productsResults, product =>
            <Product
              {...product}
              key={toStringId(product)}
              onAddButtonClick={() => props.openAddProductModal(product)}
            />
          )}
        </div>
      </div>
    )
  }

  renderSpacesPagination() {
    const { props, state } = this

    return size(state.spacesResults) < get(props, 'spaces.count') ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetchSpaces}
          disabled={state.isSearhingSpaces}
          className="button button--outline"
        >
          {state.isSearhingSpaces ? (
            'Loading More Spaces...'
          ) : (
            'Load More Spaces'
          )}
        </button>
      </div>
    ) : null
  }

  renderProductsPagination() {
    const { props, state } = this

    return size(state.productsResults) < get(props, 'products.count') ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetchProducts}
          disabled={state.isSearhingProducts}
          className="button button--outline"
        >
          {state.isSearhingProducts ? (
            'Loading More Products...'
          ) : (
            'Load More Products'
          )}
        </button>
      </div>
    ) : null
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
        />

        <div className="spaceType-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}

          {!isEmpty(get(props, 'spaces.results', [])) ? (
            <div className="grid-container" id="spaces">
              <h3 className="grid-title">Spaces</h3>
              {this.renderSpaces()}
              {this.renderSpacesPagination()}
            </div>
          ) : null}

          {!isEmpty(get(props, 'products.results', [])) ? (
            <div className="grid-container" id="products">
              <h3 className="grid-title">Products</h3>
              {this.renderProducts()}
              {this.renderProductsPagination()}
            </div>
          ) : null}
        </div>
      </Layout>
    )
  }
}

export default addProductModalContainer(
  sharePopupContainer(SpaceTypeDetail)
)
