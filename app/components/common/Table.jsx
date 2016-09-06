import get from 'lodash/get'
import map from 'lodash/map'
import filter from 'lodash/filter'
import toLower from 'lodash/toLower'
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import includes from 'lodash/includes'
import endsWith from 'lodash/endsWith'
import startsWith from 'lodash/startsWith'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

export default class AdminTable extends Component {
  static propTypes = {
    items: PropTypes.array,
    count: PropTypes.number,
    searchPath: PropTypes.string,
    headerTitle: PropTypes.string,
    tableHeaders: PropTypes.array,
    headerCtaLink: PropTypes.string,
    headerCtaText: PropTypes.string,
    renderTableRow: PropTypes.func.isRequired,
    searchPlaceholder: PropTypes.string,
    defaultSortingOrder: PropTypes.string,
    defaultSortingProperty: PropTypes.string
  }

  static defaultProps = {
    items: [],
    count: 0,
    searchPath: 'name'
  }

  constructor(props) {
    super(props)

    this.state = {
      searchQuery: '',
      sortedItems: get(props, 'items', []),
      sortingOrder: get(props, 'defaultSortingOrder', 'desc'),
      sortingProperty: get(props, 'defaultSortingProperty', 'createdAt')
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.items)) {
      this.setState({
        sortedItems: nextProps.items
      })
    }
  }

  onSearchChange = ({ currentTarget: input }) => {
    this.searchItems(input.value)
  }

  onTableHeaderClick = (property) => {
    this.sortItems(property)
  }

  sortItems(property) {
    const { props, state } = this
    const newSortingOrder = props.sortingOrder === 'desc'
      ? 'asc'
      : 'desc'

    if (property) {
      this.setState({
        sortedItems: orderBy(state.sortedItems, property, newSortingOrder),
        sortingOrder: newSortingOrder,
        sortingProperty: property
      })
    }
  }

  searchItems(query) {
    const { props, state } = this
    const queryToLower = query ? toLower(query) : ''

    if (!isEmpty(queryToLower)) {
      this.setState({
        sortedItems: filter(state.sortedItems, (item) => {
          const name = toLower(get(item, props.searchPath, ''))

          return (
            startsWith(name, queryToLower) ||
            includes(name, queryToLower) ||
            endsWith(name, queryToLower)
          )
        })
      })
    } else {
      this.setState({
        sortedItems: props.items
      })
    }
  }

  renderHeader() {
    const { props } = this

    return (
      <div className="table-header">
        <h1 className="table-header-title">
          {props.headerTitle} <small>({ props.count })</small>
        </h1>
        {this.renderHeaderActions()}
      </div>
    )
  }

  renderHeaderActions() {
    const { props } = this

    return (
      <div className="table-header-actions">
        <input
          type="search"
          onChange={this.onSearchChange}
          className="textfield"
          placeholder={props.searchPlaceholder}
        />
        <a href={props.headerCtaLink} className="button">
          {props.headerCtaText}
        </a>
      </div>
    )
  }

  renderTableHeader() {
    const { props, state } = this

    return (
      <thead>
        <tr>
          {map(props.tableHeaders, header =>
            <th
              key={`table-th-${header.label}`}
              onClick={() => this.onTableHeaderClick(header.property)}
              data-order={state.sortingOrder}
              data-sortable={header.property ? 'true' : null}
            >
              {header.property ? (
                <span className="table-th-sort">
                  {header.label}
                  <MaterialDesignIcon
                    name={
                      state.sortingOrder === 'desc'
                        ? 'caret-down'
                        : 'caret-up'
                      }
                    width={18}
                    height={18}
                  />
                </span>
              ) : header.label}
            </th>
          )}
        </tr>
      </thead>
    )
  }

  render() {
    const { sortedItems } = this.state
    const { renderTableRow } = this.props

    return (
      <div className="table-container">
        {this.renderHeader()}
        <div className="table-content">
          <table className="table">
            {this.renderTableHeader()}
            <tbody>
              {map(sortedItems, renderTableRow)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
