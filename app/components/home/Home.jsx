import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { Link } from 'react-router'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'
import RelatedRooms from '../spaceType/Related'
import CategoryCard from '../category/Card'
import SpaceTypeCard from '../spaceType/Card'
import RelatedProducts from '../product/Related'
import AddProductModal from '../modal/AddProduct'
import RelatedCategories from '../category/Related'
import LatestGuideBanner from '../guide/Banner'
import addProductModalContainer from '../container/AddProductModal'

import fullReload from '../../utils/fullReload'
import toStringId from '../../api/utils/toStringId'

class Home extends Component {
  static propTypes = {
    users: PropTypes.array,
    rooms: PropTypes.array,
    spaces: PropTypes.array,
    products: PropTypes.array,
    categories: PropTypes.array,
    relatedRooms: PropTypes.array,
    relatedProducts: PropTypes.array,
    trendingProducts: PropTypes.array,
    relatedCategories: PropTypes.array,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createAddProductModal: PropTypes.bool
  }

  static defaultProps = {
    users: [],
    rooms: [],
    spaces: [],
    products: [],
    categories: [],
    relatedRooms: [],
    relatedProducts: [],
    trendingProducts: [],
    relatedCategories: [],
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createAddProductModal: false
  }

  renderSpaces() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(props.spaces, space =>
            <SpaceCard key={toStringId(space)} {...space} />
          )}
        </div>
      </div>
    )
  }

  renderTrendingProducts() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(props.trendingProducts, product =>
            <ProductCard
              {...product}
              key={toStringId(product)}
              onAddButtonClick={() => props.openAddProductModal(product)}
            />
          )}
        </div>
      </div>
    )
  }

  renderProducts() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(props.products, product =>
            <ProductCard
              {...product}
              key={toStringId(product)}
              onAddButtonClick={() => props.openAddProductModal(product)}
            />
          )}
        </div>
      </div>
    )
  }

  renderRelatedProducts() {
    const { props } = this

    return map(props.relatedProducts, products =>
      <RelatedProducts
        key={`related-products-${toStringId(get(products, 'main'))}`}
        products={products}
        onAddButtonClick={product => props.openAddProductModal(product)}
      />
    )
  }

  renderUsers() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(props.users, user =>
            <ProfileCard key={toStringId(user)} user={user} />
          )}
        </div>
      </div>
    )
  }

  renderCategories() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(props.categories, category =>
            <CategoryCard key={toStringId(category)} {...category} />
          )}
        </div>
      </div>
    )
  }

  renderRelatedCategories() {
    const { props } = this

    return map(props.relatedCategories, categories =>
      <RelatedCategories
        key={`related-categories-${toStringId(get(categories, 'main'))}`}
        categories={categories}
        onAddButtonClick={product => props.openAddProductModal(product)}
      />
    )
  }

  renderRooms() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(props.rooms, room =>
            <SpaceTypeCard key={toStringId(room)} {...room} />
          )}
        </div>
      </div>
    )
  }

  renderRelatedRooms() {
    const { props } = this

    return map(props.relatedRooms, rooms =>
      <RelatedRooms
        key={`related-rooms-${toStringId(get(rooms, 'main'))}`}
        rooms={rooms}
        onAddButtonClick={product => props.openAddProductModal(product)}
      />
    )
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <LatestGuideBanner />

        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
        />

        {!isEmpty(props.trendingProducts) ? (
          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Trending Products</h3>
              <Link
                to={{ pathname: '/products/?sorting=newest' }}
                onClick={fullReload}
                className="button button--small button--outline"
                activeClassName="is-active"
              >
                <span className="button-text">
                  Latest Products
                </span>
              </Link>
            </div>
            {this.renderTrendingProducts()}
          </div>
        ) : null}

        <div className="grids">
          {!isEmpty(props.spaces) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Popular Spaces</h3>
                <Link
                  to={{ pathname: '/spaces/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  <span className="button-text">
                    All Spaces
                  </span>
                </Link>
              </div>
              {this.renderSpaces()}
            </div>
          ) : null}

          {!isEmpty(props.products) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Popular Products</h3>
                <Link
                  to={{ pathname: '/products/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  <span className="button-text">
                    All Products
                  </span>
                </Link>
              </div>
              {this.renderProducts()}
            </div>
          ) : null}

          {!isEmpty(props.relatedProducts)
            ? this.renderRelatedProducts()
            : null
          }

          {!isEmpty(props.rooms) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Popular Rooms</h3>
                <Link
                  to={{ pathname: '/rooms/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  <span className="button-text">
                    All Rooms
                  </span>
                </Link>
              </div>
              {this.renderRooms()}
            </div>
          ) : null}

          {!isEmpty(props.relatedRooms)
            ? this.renderRelatedRooms()
            : null
          }

          {!isEmpty(props.users) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Popular Users</h3>
                <Link
                  to={{ pathname: '/community/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  <span className="button-text">
                    Community
                  </span>
                </Link>
              </div>
              {this.renderUsers()}
            </div>
          ) : null}

          {!isEmpty(props.categories) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Categories</h3>
                <Link
                  to={{ pathname: '/categories/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  <span className="button-text">
                    All Categories
                  </span>
                </Link>
              </div>
              {this.renderCategories()}
            </div>
          ) : null}

          {!isEmpty(props.relatedCategories)
            ? this.renderRelatedCategories()
            : null
          }
        </div>
      </Layout>
    )
  }
}

export default addProductModalContainer(Home)
