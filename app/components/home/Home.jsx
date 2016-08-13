import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { Link } from 'react-router'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'
import CategoryCard from '../category/Card'
import SpaceTypeCard from '../spaceType/Card'
import AddProductModal from '../modal/AddProduct'
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

  renderDesigners() {
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

  render() {
    const { props } = this

    return (
      <Layout>
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
        />

        <h1 className="page-title">Trending on Spaces</h1>

        <div className="grids">
          {!isEmpty(props.spaces) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Spaces</h3>
                <Link
                  to={{ pathname: '/spaces/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  All Spaces
                </Link>
              </div>
              {this.renderSpaces()}
            </div>
          ) : null}

          {!isEmpty(props.rooms) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Rooms</h3>
                <Link
                  to={{ pathname: '/rooms/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  All Rooms
                </Link>
              </div>
              {this.renderRooms()}
            </div>
          ) : null}

          {!isEmpty(props.users) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Designers</h3>
                <Link
                  to={{ pathname: '/designers/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  All Designers
                </Link>
              </div>
              {this.renderDesigners()}
            </div>
          ) : null}

          {!isEmpty(props.products) ? (
            <div className="grid-container">
              <div className="grid-title-container">
                <h3 className="grid-title">Products</h3>
                <Link
                  to={{ pathname: '/products/' }}
                  onClick={fullReload}
                  className="button button--small button--outline"
                  activeClassName="is-active"
                >
                  All Products
                </Link>
              </div>
              {this.renderProducts()}
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
                  All Categories
                </Link>
              </div>
              {this.renderCategories()}
            </div>
          ) : null}
        </div>
      </Layout>
    )
  }
}

export default addProductModalContainer(Home)
