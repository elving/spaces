import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Sticky from '../common/Sticky'
import CategoryCard from '../category/Card'
import SpaceTypeCard from '../spaceType/Card'

import toStringId from '../../api/utils/toStringId'

export default class Onboarding extends Component {
  static contextTypes = {
    user: PropTypes.object
  }

  static propTypes = {
    interests: PropTypes.array
  }

  static defaultProps = {
    interests: []
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      following: size(get(context.user, 'following', []))
    }
  }

  onFollow = () => {
    const { state } = this

    this.setState({
      following: state.following + 1
    })
  }

  onUnfollow = () => {
    const { state } = this

    this.setState({
      following: state.following - 1
    })
  }

  renderInterests() {
    const { props } = this

    return (
      <div className="grid">
        <div className="grid-items grid-items--3-cards">
          {map(props.interests, interest => {
            if (get(interest, 'type') === 'category') {
              return (
                <CategoryCard
                  key={toStringId(interest)}
                  onFollow={this.onFollow}
                  onUnfollow={this.onUnfollow}
                  {...interest}
                />
              )
            }

            return (
              <SpaceTypeCard
                key={toStringId(interest)}
                onFollow={this.onFollow}
                onUnfollow={this.onUnfollow}
                {...interest}
              />
            )
          })}
        </div>
      </div>
    )
  }

  render() {
    const { props, state } = this

    return (
      <Layout>
        <h1 className="page-title">
          Build Your Feed
        </h1>

        <Sticky>
          <div className="onboarding-header">
            <h2 className="onboarding-header-title">
              Follow at least 5 interests to build your personal feed.
            </h2>

            <div className="onboarding-header-count">
              <span className="onboarding-header-count-left">
                {state.following} / 5
              </span>
              <a
                href="/feed/"
                disabled={state.following < 5}
                className="onboarding-header-button button button--primary-alt"
              >
                Continue
              </a>
            </div>
          </div>
        </Sticky>

        <div className="grids">
          {!isEmpty(props.interests) ? (
            <div className="grid-container">
              {this.renderInterests()}
            </div>
          ) : null}
        </div>
      </Layout>
    )
  }
}
