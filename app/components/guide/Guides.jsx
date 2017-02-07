import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import find from 'lodash/find'
import axios from 'axios'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import classNames from 'classnames'
import queryString from 'query-string'
import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import Guide from './Card'
import Loader from '../common/Loader'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import hasEmptyIdParam from '../../utils/hasEmptyIdParam'

const guideSortingTypes = [{
  sort: '-createdAt',
  label: 'Newest'
}, {
  sort: '-followersCount',
  label: 'Popular'
}]

export default class Guides extends Component {
  static propTypes = {
    params: PropTypes.object,
    guides: PropTypes.object,
    emptyMessage: PropTypes.string,
    disableSorting: PropTypes.bool,
    disablePagination: PropTypes.bool
  }

  static defaultProps = {
    params: {},
    guides: {},
    emptyMessage: 'No Guides Found...',
    disableSorting: false,
    disablePagination: false
  }

  constructor(props) {
    super(props)

    const count = get(props.guides, 'count', 0)
    const results = get(props.guides, 'results', [])

    this.state = {
      skip: 40,
      sort: 'Newest',
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

    if (isEmpty(props.guides) && !hasEmptyIdParam(props.params)) {
      this.fetch()
    }
  }

  getSorting = label => (
    get(find(guideSortingTypes, type =>
      type.label === label
    ), 'sort')
  )

  fetch = sorting => {
    const { props } = this
    const newSorting = isString(sorting) ? sorting : null

    const reset = newSorting ? {
      count: 0,
      offset: 0,
      results: [],
      hasFetched: false,
      lastResults: []
    } : {}

    this.setState(assign(reset, {
      sort: (newSorting || this.state.sort),
      isFetching: true
    }), () => {
      const { state } = this
      const sort = this.getSorting(newSorting || state.sort)
      const params = queryString.stringify(
        assign(get(props, 'params', {}), { sort })
      )

      axios
        .get(`/ajax/guides/search/?skip=${state.offset}&${params}`)
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
            isFetching: false
          })
        })
    })
  }

  renderPagination() {
    const { props, state } = this

    if (props.disablePagination) {
      return null
    }

    return size(state.results) < state.count ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetch}
          disabled={state.isFetching}
          className="button button--outline"
        >
          <span className="button-text">
            {state.isFetching ? (
              'Loading More Guides...'
            ) : (
              'Load More Guides'
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
          {map(guideSortingTypes, type =>
            <a
              key={`guide-sort-type-${type.label}`}
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

  renderGuides() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.guides, 'results', []))
    )

    return (
      <div className="grid">
        {!props.disableSorting ? (
          <div className="grid-sorting">
            {this.renderSorting()}
          </div>
        ) : null}
        <div className="grid-items grid-items--2-cards">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, guide =>
              <Guide
                {...guide}
                key={toStringId(guide)}
              />
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
        <Loader size={52} />
      </div>
    ) : (
      <div className="grids">
        {this.renderGuides()}
        {this.renderPagination()}
      </div>
    )
  }
}
