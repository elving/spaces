import map from 'lodash/map'
import { Link } from 'react-router'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'
import CategoryCard from '../category/Card'
import AddProductModal from '../modal/AddProduct'
import AddProductModalContainer from '../container/AddProductModal'

import fullReload from '../../utils/fullReload'
import toStringId from '../../utils/toStringId'

class Home extends Component {
  static propTypes = {
    users: PropTypes.array,
    spaces: PropTypes.array,
    products: PropTypes.array,
    categories: PropTypes.array,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createaddProductModal: PropTypes.bool
  };

  static defaultProps = {
    users: [],
    spaces: [],
    products: [],
    categories: [],
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createaddProductModal: false
  };

  renderSpaces() {
    const { spaces } = this.props

    return (
      <div className="grid">
        <div className="grid-items">
          {map(spaces, (space) => (
            <SpaceCard key={toStringId(space)} {...space}/>
          ))}
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
              onAddButtonClick={() => props.openAddProductModal(product)}/>
          )}
        </div>
      </div>
    )
  }

  renderDesigners() {
    const { users } = this.props

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(users, (user) => (
            <ProfileCard key={toStringId(user)} user={user}/>
          ))}
        </div>
      </div>
    )
  }

  renderCategories() {
    const { categories } = this.props

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(categories, (category) => (
            <CategoryCard key={toStringId(category)} {...category}/>
          ))}
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

        <h1 className="page-title">Trending on Spaces</h1>

        <div className="grids">
          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Spaces</h3>
              <Link
                to={{pathname: '/spaces/'}}
                onClick={fullReload}
                className="button button--small button--outline"
                activeClassName="is-active">
                All Spaces
              </Link>
            </div>
            {this.renderSpaces()}
          </div>

          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Designers</h3>
              <Link
                to={{pathname: '/designers/'}}
                onClick={fullReload}
                className="button button--small button--outline"
                activeClassName="is-active">
                All Designers
              </Link>
            </div>
            {this.renderDesigners()}
          </div>

          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Products</h3>
              <Link
                to={{pathname: '/products/'}}
                onClick={fullReload}
                className="button button--small button--outline"
                activeClassName="is-active">
                All Products
              </Link>
            </div>
            {this.renderProducts()}
          </div>

          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Categories</h3>
              <Link
                to={{pathname: '/categories/'}}
                onClick={fullReload}
                className="button button--small button--outline"
                activeClassName="is-active">
                All Categories
              </Link>
            </div>
            {this.renderCategories()}
          </div>
        </div>
      </Layout>
    )
  }
}

export default AddProductModalContainer(Home)
