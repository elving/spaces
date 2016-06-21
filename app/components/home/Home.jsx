import map from 'lodash/map'
import { Link } from 'react-router'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import ProfileCard from '../user/Card'
import CategoryCard from '../category/Card'

import fullReload from '../../utils/fullReload'
import toStringId from '../../utils/toStringId'

export default class Home extends Component {
  static propTypes = {
    users: Type.array,
    spaces: Type.array,
    products: Type.array,
    categories: Type.array
  };

  static defaultProps = {
    users: [],
    spaces: [],
    products: [],
    categories: []
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
    const { products } = this.props

    return (
      <div className="grid">
        <div className="grid-items">
          {map(products, (product) => (
            <ProductCard key={toStringId(product)} {...product}/>
          ))}
        </div>
      </div>
    )
  }

  renderDesigners() {
    const { users } = this.props

    return (
      <div className="grid">
        <div className="grid-items">
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
        <div className="grid-items">
          {map(categories, (category) => (
            <CategoryCard key={toStringId(category)} {...category}/>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <h1 className="home-title">Trending on Spaces</h1>

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
              <a href="#" className="button button--small button--outline">
                All Designers
              </a>
            </div>
            {this.renderDesigners()}
          </div>

          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Products</h3>
              <a href="#" className="button button--small button--outline">
                All Products
              </a>
            </div>
            {this.renderProducts()}
          </div>

          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Categories</h3>
              <a href="#" className="button button--small button--outline">
                All Categories
              </a>
            </div>
            {this.renderCategories()}
          </div>
        </div>
      </Layout>
    )
  }
}
