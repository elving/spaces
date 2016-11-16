import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import find from 'lodash/find'
import axios from 'axios'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import queryString from 'query-string'
import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import Loader from '../common/Loader'
import Category from './Card'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import sortingIsValid from '../../utils/sortingIsValid'
import hasEmptyIdParam from '../../utils/hasEmptyIdParam'
import reverseKebabCase from '../../utils/reverseKebabCase'

const categorySortingTypes = [{
  sort: '-followersCount -spacesCount -productsCount',
  label: 'Popular'
}, {
  sort: '-productsCount',
  label: 'Most Products'
}, {
  sort: '-spacesCount',
  label: 'Most Spaces'
}]

export default class Categories extends Component {
  static propTypes = {
    params: PropTypes.object,
    sorting: PropTypes.string,
    categories: PropTypes.object,
    emptyMessage: PropTypes.string
  }

  static defaultProps = {
    params: {},
    sorting: 'Popular',
    categories: {},
    emptyMessage: 'No Categories Found...'
  }

  constructor(props) {
    super(props)

    const sort = reverseKebabCase(get(props, 'sorting', 'Popular'))
    const count = get(props.categories, 'count', 0)
    const results = get(props.categories, 'results', [])

    this.state = {
      skip: 40,
      sort: sortingIsValid(categorySortingTypes, sort) ? sort : 'Popular',
      count,
      offset: size(results),
      results,
      isFetching: isEmpty(results) && !hasEmptyIdParam(props.params),
      hasFetched: !isEmpty(results),
      lastResults: results
    }
  }

  componentDidMount() {
    const { props } = this

    if (isEmpty(props.categories) && !hasEmptyIdParam(props.params)) {
      this.fetch()
    }
  }

  getSorting = label => (
    get(find(categorySortingTypes, type =>
      type.label === label
    ), 'sort')
  )

  fetch = sorting => {
    const { props } = this

    const reset = sorting ? {
      count: 0,
      offset: 0,
      results: [],
      hasFetched: false,
      lastResults: []
    } : {}

    this.setState(assign(reset, {
      sort: (sorting || this.state.sort),
      isFetching: true
    }), () => {
      const { state } = this
      const sort = this.getSorting(sorting || state.sort)
      const params = queryString.stringify(
        assign(get(props, 'params', {}), { sort })
      )

      axios
        .get(`/ajax/categories/search/?skip=${state.offset}&${params}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])

          this.setState({
            count: get(data, 'count', 0),
            offset: state.offset + size(results),
            results: concat(state.results, results),
            isFetching: false,
            hasFetched: true,
            lastResults: results
          })
        })
        .catch(() => {
          this.setState({
            isWaiting: false
          })
        })
    })
  }

  renderPagination() {
    const { state } = this

    return size(state.results) < state.count ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetch}
          disabled={state.isFetching}
          className="button button--outline"
        >
          <span className="button-text">
            {state.isFetching ? (
              'Loading More Categories...'
            ) : (
              'Load More Categories'
            )}
          </span>
        </button>
      </div>
    ) : null
  }

  renderSorting() {
    const { state } = this

    return (
      <Dropdown
        ref={sortingDropdown => { this.sortingDropdown = sortingDropdown }}
        className="dropdown"
        data-sorting={state.sort}
      >
        <DropdownTrigger className="dropdown-trigger">
          <MaterialDesignIcon name="cards" style={{ marginRight: 5 }} />
          Sort by {state.sort}
        </DropdownTrigger>
        <DropdownContent
          className="dropdown-content dropdown-content--left"
        >
          {map(categorySortingTypes, type =>
            <a
              key={`category-sort-type-${type.label}`}
              href={`#${type.label}`}
              onClick={event => {
                event.preventDefault()
                this.sortingDropdown.hide()
                this.fetch(type.label)
              }}
              className={classNames({
                'dropdown-link': true,
                'dropdown-link--active': type.label === state.sort
              })}
            >
              {type.label}
            </a>
          )}
        </DropdownContent>
      </Dropdown>
    )
  }

  renderCategories() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.categories, 'results', []))
    )

    return (
      <div className="grid">
        <div className="grid-sorting">
          {this.renderSorting()}
        </div>
        <div className="grid-items grid-items--3-cards">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, category =>
              <Category {...category} key={toStringId(category)} />
            )
          )}
        </div>
      </div>
    )
  }

  render() {
    const { state } = this

    return state.isFetching && !state.hasFetched ? (
      <div className="grids">
        <Loader size="52" />
      </div>
    ) : (
      <div className="grids">
        {this.renderCategories()}
        {this.renderPagination()}
      </div>
    )
  }
}
