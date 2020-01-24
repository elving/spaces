import get from 'lodash/get'
import map from 'lodash/map'
import head from 'lodash/head'
import find from 'lodash/find'
import join from 'lodash/join'
import toLower from 'lodash/toLower'
import isEmpty from 'lodash/isEmpty'
import indexOf from 'lodash/indexOf'
import includes from 'lodash/includes'
import classNames from 'classnames'
import filterCollection from 'lodash/filter'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Loader from '../common/Loader'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toggle from '../../utils/toggle'
import toStringId from '../../api/utils/toStringId'
import withoutAnyType from '../../utils/spaceType/withoutAnyType'

export default class Finder extends Component {
  static propTypes = {
    filters: PropTypes.object
  }

  static defaultProps = {
    filters: {}
  }

  state = {
    rooms: [],
    colors: [],
    categories: [],
    currentStep: 'pick-room',
    searchingProducts: false
  }

  getSelectedRoom() {
    const rooms = get(this.props, 'filters.spaceTypes', [])
    return find(rooms, ['id', head(this.state.rooms)])
  }

  steps = ['pick-room', 'pick-categories', 'pick-colors']

  toggleFilter = (id, type) => {
    if (type === 'rooms' && !isEmpty(this.state[type])) {
      return this.setState({
        rooms: head(this.state[type]) === id ? [] : [id]
      })
    }

    this.setState((prevState) => ({
      [type]: toggle(prevState[type], id)
    }))
  }

  filterIsSelected(id, type) {
    return includes(this.state[type], id)
  }

  hasFiltersSelected() {
    const { rooms, colors, categories, currentStep } = this.state

    if (currentStep === 'pick-room') {
      return !isEmpty(rooms)
    } else if (currentStep === 'pick-categories') {
      return !isEmpty(categories)
    } else if (currentStep === 'pick-colors') {
      return !isEmpty(colors)
    }

    return false
  }

  goToPrevStep = () => {
    this.setState({
      currentStep: this.steps[indexOf(this.steps, this.state.currentStep) - 1]
    })
  }

  goToNextStep = () => {
    this.setState({
      currentStep: this.steps[indexOf(this.steps, this.state.currentStep) + 1]
    })
  }

  showResults = () => {
    this.setState({
      searchingProducts: true
    }, () => {
      const room = !isEmpty(this.state.rooms)
        ? `&spaceTypes=${head(this.state.rooms)}`
        : ''

      const colors = !isEmpty(this.state.colors)
        ? `&colors=${join(this.state.colors, '%2C')}`
        : ''

      const categories = !isEmpty(this.state.categories)
        ? `&categories=${join(this.state.categories, '%2C')}`
        : ''

      const searchQuery = `${room}${colors}${categories}`
      window.location.href = `/search/?type=products${searchQuery}`
    })
  }

  renderTitle() {
    switch (this.state.currentStep) {
      case 'pick-room': {
        return (
          <h1 className="product-finder-title page-title">
            What room are you looking products for?
          </h1>
        )
      }

      case 'pick-categories': {
        return (
          <h1 className="product-finder-title page-title">
            What are you interested in?
          </h1>
        )
      }

      case 'pick-colors': {
        return (
          <h1 className="product-finder-title page-title">
            Are you looking for any colors in particular?
          </h1>
        )
      }

      default: {
        return null
      }
    }
  }

  renderActions() {
    return (
      <div className="product-finder-actions">
        {this.state.currentStep !== 'pick-room' ? (
          <button
            type="button"
            onClick={this.goToPrevStep}
            className="product-finder-action button"
          >
            <span className="button-text">
              Go Back
            </span>
          </button>
        ) : null}
        {this.state.currentStep === 'pick-colors' ? (
          <button
            type="button"
            onClick={this.showResults}
            className="product-finder-action button button--primary"
          >
            <span className="button-text">
              Find Products
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={this.goToNextStep}
            className="product-finder-action button button--primary-alt"
          >
            <span className="button-text">
              {this.hasFiltersSelected() ? 'Continue' : 'Skip'}
            </span>
          </button>
        )}
      </div>
    )
  }

  renderFilter = (filter, type) => {
    const id = toStringId(filter)
    const isSelected = this.filterIsSelected(id, type)
    const searchingProducts = this.state.searchingProducts

    return (
      <button
        key={`filter-${type}-${id}`}
        type="button"
        style={{
          cursor: searchingProducts ? 'default' : 'pointer'
        }}
        onClick={searchingProducts
          ? null
          : this.toggleFilter.bind(this, id, type)
        }
        className={classNames({
          button: true,
          'button--outline': true,
          'button--primary-alt': isSelected || searchingProducts,
          'product-finder-filter': true
        })}
      >
        <span className="button-text">
          {searchingProducts ? (
            <MaterialDesignIcon name={get(filter, 'type')} />
          ) : null}
          {get(filter, 'name')}
        </span>
      </button>
    )
  }

  renderFilters() {
    const rooms = get(this.props, 'filters.spaceTypes', [])
    const colors = get(this.props, 'filters.colors', [])
    const categories = get(this.props, 'filters.categories', [])
    const selectedRoom = this.getSelectedRoom()

    const selectedRoomCategories = !isEmpty(selectedRoom)
      ? get(selectedRoom, 'categories', [])
      : []

    const recommendedCategories = !isEmpty(selectedRoom)
      ? filterCollection(categories, category =>
        includes(map(selectedRoomCategories, 'id'), toStringId(category))
      ) : []

    const otherCategories = !isEmpty(recommendedCategories)
      ? filterCollection(categories, category =>
        !includes(map(recommendedCategories, 'id'), toStringId(category))
      ) : categories

    switch (this.state.currentStep) {
      case 'pick-room': {
        return map(withoutAnyType(rooms), room =>
          this.renderFilter(room, 'rooms')
        )
      }

      case 'pick-categories': {
        return !isEmpty(selectedRoom) ? (
          <div className="product-finder-categories">
            {!isEmpty(recommendedCategories) ? (
              <div className="product-finder-sub-filters">
                <div className="product-finder-filters-title">
                  Recommended for your {toLower(get(selectedRoom, 'name'))}
                </div>
                <div className="product-finder-filters">
                  {map(withoutAnyType(recommendedCategories), category =>
                    this.renderFilter(category, 'categories')
                  )}
                </div>
              </div>
            ) : null}
            {map(withoutAnyType(otherCategories), category =>
              this.renderFilter(category, 'categories')
            )}
          </div>
        ) : (
          map(withoutAnyType(categories), category =>
            this.renderFilter(category, 'categories')
          )
        )
      }

      case 'pick-colors': {
        return map(colors, color =>
          this.renderFilter(color, 'colors')
        )
      }

      default: {
        return null
      }
    }
  }

  renderSelectedFilters() {
    const rooms = get(this.props, 'filters.spaceTypes')
    const selectedRooms = map(this.state.rooms, room =>
      find(rooms, ['id', room])
    )

    const colors = get(this.props, 'filters.colors')
    const selectedColors = map(this.state.colors, color =>
      find(colors, ['id', color])
    )

    const categories = get(this.props, 'filters.categories')
    const selectedCategories = map(this.state.categories, category =>
      find(categories, ['id', category])
    )

    return (
      <div className="product-finder-filters">
        {map(selectedRooms, room => this.renderFilter(room, 'rooms'))}
        {map(selectedCategories, category =>
          this.renderFilter(category, 'categories')
        )}
        {map(selectedColors, color => this.renderFilter(color, 'colors'))}
      </div>
    )
  }

  render() {
    return this.state.searchingProducts ? (
      <Layout className="product-finder product-finder--searching">
        <h1 className="page-title">
          Finding Products...
        </h1>
        {this.renderSelectedFilters()}
        <Loader size={52} />
      </Layout>
    ) : (
      <Layout className="product-finder">
        <div className="product-finder-header">
          {this.renderTitle()}
          {this.renderActions()}
        </div>
        <div className="product-finder-filters">
          {this.renderFilters()}
        </div>
      </Layout>
    )
  }
}
