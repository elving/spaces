import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import SpaceCard from '../space/Card'
import ProductCard from '../product/Card'
import AddProductModal from '../modal/AddProduct'
import OnboardingModal from '../modal/Onboarding'
import addProductModalContainer from '../container/AddProductModal'

import toStringId from '../../api/utils/toStringId'

class Feed extends Component {
  static propTypes = {
    feed: PropTypes.object,
    location: PropTypes.object
  }

  static defaultProps = {
    feed: {},
    location: {}
  }

  constructor(props) {
    super(props)

    this.state = {
      onboardingModalIsOpen: get(props.location, 'query.onboarding') === '1'
    }
  }

  onOnboardingClose = () => {
    this.setState({
      onboardingModalIsOpen: false
    })
  }

  renderCards() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items">
          {map(get(props.feed, 'results', []), result => {
            const type = get(result, 'type')

            if (type === 'product') {
              return (
                <ProductCard
                  {...result}
                  key={toStringId(result)}
                  onAddButtonClick={() => props.openAddProductModal(result)}
                />
              )
            } else if (type === 'space') {
              return (
                <SpaceCard key={toStringId(result)} {...result} />
              )
            }

            return null
          })}
        </div>
      </div>
    )
  }

  render() {
    const { props, state } = this

    return (
      !isEmpty(get(props.feed, 'results', [])) ? (
        <Layout>
          <OnboardingModal
            onClose={this.onOnboardingClose}
            isVisible={state.onboardingModalIsOpen}
          />

          <AddProductModal
            product={props.addProductModalCurrent}
            onClose={props.closeAddProductModal}
            isVisible={props.addProductModalIsOpen}
          />

          <h1 className="page-title">Your Feed</h1>

          <div className="grids">
            <div className="grid-container">
              {this.renderCards()}
            </div>
          </div>
        </Layout>
      ) : (
        <Layout>
          <h1 className="page-title">Your Feed</h1>

          <div className="feed-empty">
            <h2 className="feed-empty-title">
              It looks like you don't have enough interests to generate
              your personal feed.
            </h2>
            <a
              href="/onboarding/"
              className="feed-empty-btn button button--primary-alt"
            >
              Follow More Interests
            </a>
          </div>
        </Layout>
      )
    )
  }
}

export default addProductModalContainer(Feed)
