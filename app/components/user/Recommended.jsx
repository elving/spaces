import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import ProductCard from '../product/Card'
import AddProductModal from '../modal/AddProduct'
import addProductModalContainer from '../container/AddProductModal'

import toStringId from '../../api/utils/toStringId'

class UserRecommendedProducts extends Component {
  static propTypes = {
    params: PropTypes.object,
    products: PropTypes.array
  }

  static defaultProps = {
    params: {},
    products: []
  }

  renderProductsPageUrl = () => {
    const { props } = this

    return (
      <a href={`/designers/${get(props.params, 'username')}/products/`}>
        your products page
      </a>
    )
  }

  render() {
    const { props } = this

    return (
      <Layout className="user-recommended-products">
        <h1 className="page-title user-recommended-products-title">
          Your recommendations
        </h1>

        {!isEmpty(props.products) ? (
          <h2 className="user-recommended-products-subtitle">
            These products have been recommended by you and are being
            reviewed to see if they get to be featured on Spaces.
            If any products you have recommended are not here or
            in {this.renderProductsPageUrl()} they have been declined.
          </h2>
        ) : (
          <h2 className="user-recommended-products-empty">
            You haven&apos;t recommended any products yet...
            <a
              href="/about/#curating-products"
              className="button button--primary-alt"
            >
              Get started
            </a>
          </h2>
        )}

        {!isEmpty(props.products) ? (
          <AddProductModal
            product={props.addProductModalCurrent}
            onClose={props.closeAddProductModal}
            isVisible={props.addProductModalIsOpen}
          />
        ) : null}

        {!isEmpty(props.products) ? (
          <div className="grid-container">
            <div className="grid-title-container">
              <h3 className="grid-title">Products you&apos;ve recommended</h3>
              <a
                href={`/designers/${get(props.params, 'username')}/products/`}
                className="button button--small button--outline"
              >
                <span className="button-text">
                  Approved Products
                </span>
              </a>
            </div>
            <div className="grid">
              <div className="grid-items">
                {map(props.products, product =>
                  <ProductCard
                    {...product}
                    key={toStringId(product)}
                    forDisplayOnly
                    onAddButtonClick={() => props.openAddProductModal(product)}
                  />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Layout>
    )
  }
}

export default addProductModalContainer(UserRecommendedProducts)
