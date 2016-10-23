import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Tag from '../common/Tag'
import Layout from '../common/Layout'
import ProductCard from '../product/Card'
import AddProductModal from '../modal/AddProduct'
import CreateSpaceBanner from '../onboarding/Banner'
import addProductModalContainer from '../container/AddProductModal'

import toStringId from '../../api/utils/toStringId'

class Suggestions extends Component {
  static propTypes = {
    spaces: PropTypes.array,
    hasSpaces: PropTypes.bool
  }

  static defaultProps = {
    spaces: [],
    hasSpaces: false
  }

  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

  renderProducts(space) {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(get(space, 'products', []), product =>
            <ProductCard
              {...product}
              key={`${toStringId(space)}-${toStringId(product)}`}
              onAddButtonClick={() => props.openAddProductModal(product)}
            />
          )}
        </div>
      </div>
    )
  }

  render() {
    const { props, context } = this

    if (!isEmpty(props.spaces)) {
      return (
        <Layout
          className={classNames({
            'user-is-onboarding': context.currentUserIsOnboarding()
          })}
        >
          {context.currentUserIsOnboarding() ? (
            <CreateSpaceBanner />
          ) : null}

          <AddProductModal
            product={props.addProductModalCurrent}
            onClose={props.closeAddProductModal}
            isVisible={props.addProductModalIsOpen}
          />

          <h1 className="page-title">Your Suggestions</h1>

          <div className="grids">
            {map(props.spaces, space =>
              <div
                key={`space-${toStringId(space)}`}
                className="grid-container"
              >
                <div className="grid-title-container">
                  <h3 className="grid-title has-subtitle">
                    <small className="grid-title-top-subtitle">
                      {get(space, 'spaceType.name', 'Space')}
                    </small>
                    {space.name}
                  </h3>
                  <a
                    href={`/${space.detailUrl}/`}
                    className="button button--small button--outline"
                  >
                    <span className="button-text">
                      Go to space
                    </span>
                  </a>
                </div>
                <div className="tags-container">
                  {map(get(space, 'spaceType.categories', []), category =>
                    <Tag
                      key={`suggestion-${toStringId(category)}`}
                      url={`/${category.detailUrl}/`}
                      type={category.type}
                      name={category.name}
                      size="big"
                    />
                  )}
                </div>
                {this.renderProducts(space)}
              </div>
            )}
          </div>
        </Layout>
      )
    } else if (isEmpty(props.spaces) && props.hasSpaces) {
      return (
        <Layout>
          <h1 className="page-title">Your Suggestions</h1>

          <div className="feed-empty">
            <h2 className="feed-empty-title">
              It looks like we don't have any suggestions for your spaces
              at the moment.
            </h2>
            <a
              href="/products/"
              className="feed-empty-btn button button--primary-alt"
            >
              <span className="button-text">
                Discover products
              </span>
            </a>
          </div>
        </Layout>
      )
    } else if (isEmpty(props.spaces) && !props.hasSpaces) {
      return (
        <Layout>
          <h1 className="page-title">Your Suggestions</h1>

          <div className="feed-empty">
            <h2 className="feed-empty-title">
              It looks like you haven't designed any spaces yet.
            </h2>
            <a
              href="/spaces/"
              className="feed-empty-btn button button--primary-alt"
            >
              <span className="button-text">
                Get inspired; Start designing
              </span>
            </a>
          </div>
        </Layout>
      )
    }

    return null
  }
}

export default addProductModalContainer(Suggestions)
