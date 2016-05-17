import get from 'lodash/get'
import map from 'lodash/map'
import filter from 'lodash/filter'
import toLower from 'lodash/toLower'
import isEqual from 'lodash/isEqual'
import orderBy from 'lodash/orderBy'
import includes from 'lodash/includes'
import endsWith from 'lodash/endsWith'
import startsWith from 'lodash/startsWith'
import React, { Component, PropTypes as Type } from 'react'

import Icon from './Icon'

export default class AdminTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: '',
      sortedItems: get(props, 'items', []),
      sortingOrder: get(props, 'defaultSortingOrder', 'desc'),
      sortingProperty: get(props, 'defaultSortingProperty', 'createdAt')
    }
  }

  static propTypes = {
    items: Type.array,
    count: Type.number,
    searchPath: Type.string,
    headerTitle: Type.string,
    tableHeaders: Type.array,
    headerCtaLink: Type.string,
    headerCtaText: Type.string,
    renderTableRow: Type.func.isRequired,
    searchPlaceholder: Type.string,
    defaultSortingOrder: Type.string,
    defaultSortingProperty: Type.string
  };

  static defaultProps = {
    items: [],
    count: 0,
    searchPath: 'name'
  };

  sortItems(property) {
    const { items } = this.props
    const { sortingOrder } = this.state
    const newSortingOrder = isEqual(sortingOrder, 'desc') ? 'asc' : 'desc'

    if (property) {
      this.setState({
        sortedItems: orderBy(items, property, newSortingOrder),
        sortingOrder: newSortingOrder,
        sortingProperty: property
      })
    }
  }

  searchItems(query) {
    query = query ? toLower(query) : ''

    const { sortedItems } = this.state
    const { items, searchPath } = this.props

    if (query) {
      this.setState({
        sortedItems: filter(sortedItems, (item) => {
          const name = toLower(get(item, searchPath, ''))

          return (
            startsWith(name, query) ||
            includes(name, query) ||
            endsWith(name, query)
          )
        })
      })
    } else {
      this.setState({ sortedItems: items })
    }
  }

  renderHeader() {
    const { count, headerTitle } = this.props

    return (
      <div className="table-header">
        <h1 className="table-header-title">
          {headerTitle} <small>({ count })</small>
        </h1>
        {this.renderHeaderActions()}
      </div>
    )
  }

  renderHeaderActions() {
    const { headerCtaText, headerCtaLink, searchPlaceholder } = this.props

    return (
      <div className="table-header-actions">
        <input
          type="search"
          onChange={(event) => this.searchItems(event.target.value)}
          className="textfield"
          placeholder={searchPlaceholder}/>
        <a href={headerCtaLink} className="button">
          {headerCtaText}
        </a>
      </div>
    )
  }

  renderTableHeader() {
    const { tableHeaders } = this.props
    const { sortingOrder } = this.state

    return (
      <thead>
        <tr>
          {map(tableHeaders, (header) => {
            const { label, property } = header

            return (
              <th
                key={`table-th-${label}`}
                onClick={() => this.sortItems(property)}
                data-order={sortingOrder}
                data-sortable={property ? 'true' : null}>
                {property ? (
                  <span className="table-th-sort">
                    {label}
                    <Icon
                      name={isEqual(sortingOrder, 'desc') ? 'down' : 'up'}
                      width={18}
                      height={18}/>
                  </span>
                ) : label}
              </th>
            )
          })}
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
