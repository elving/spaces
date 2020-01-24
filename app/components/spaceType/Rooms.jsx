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

import Room from './Card'
import Loader from '../common/Loader'
import GridCTA from '../cta/GridCTA'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import sortingIsValid from '../../utils/sortingIsValid'
import hasEmptyIdParam from '../../utils/hasEmptyIdParam'
import reverseKebabCase from '../../utils/reverseKebabCase'

const roomSortingTypes = [{
  sort: '-followersCount -spacesCount -productsCount',
  label: 'Popular'
}, {
  sort: '-productsCount',
  label: 'Most Products'
}, {
  sort: '-spacesCount',
  label: 'Most Spaces'
}]

export default class Rooms extends Component {
  static propTypes = {
    rooms: PropTypes.object,
    params: PropTypes.object,
    sorting: PropTypes.string,
    emptyMessage: PropTypes.string,
    disableSorting: PropTypes.bool,
    disablePagination: PropTypes.bool
  }

  static defaultProps = {
    rooms: {},
    params: {},
    sorting: 'Popular',
    emptyMessage: 'No Rooms Found...',
    disableSorting: false,
    disablePagination: false
  }

  constructor(props) {
    super(props)

    const sort = reverseKebabCase(get(props, 'sorting', 'Popular'))
    const count = get(props.rooms, 'count', 0)
    const results = get(props.rooms, 'results', [])

    if (size(results) > 6) {
      results.splice(6, 0, 'cta')
    }

    this.state = {
      skip: 40,
      sort: sortingIsValid(roomSortingTypes, sort) ? sort : 'Popular',
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

    if (isEmpty(props.rooms) && !hasEmptyIdParam(props.params)) {
      this.fetch()
    }
  }

  getSorting = label => (
    get(find(roomSortingTypes, type =>
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
        .get(`/ajax/rooms/search/?limit=1000&skip=${state.offset}&${params}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])
          const updatedResults = concat([], state.results, results)

          if (size(updatedResults) > 6 && !find(updatedResults, r => r === 'cta')) {
            updatedResults.splice(6, 0, 'cta')
          }

          this.setState({
            count: get(data, 'count', 0),
            offset: state.offset + size(results),
            results: updatedResults,
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
            {state.isFetching
              ? 'Loading More Rooms...'
              : 'Load More Rooms'
            }
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
          {map(roomSortingTypes, type =>
            <a
              key={`room-sort-type-${type.label}`}
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

  renderRooms() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.rooms, 'results', []))
    )

    return (
      <div className="grid">
        {!props.disableSorting ? (
          <div className="grid-sorting">
            {this.renderSorting()}
          </div>
        ) : null}
        <div className="grid-items grid-items--3-cards">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, room => {
              if (room === 'cta') {
                return (
                  <GridCTA />
                )
              }

              return (
                <Room {...room} key={toStringId(room)} />
              )
            })
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
        {this.renderRooms()}
        {this.renderPagination()}
      </div>
    )
  }
}
