import map from 'lodash/map'
import get from 'lodash/get'
import join from 'lodash/join'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import React, { Component } from 'react'

import Table from '../common/Table'
import Loader from '../common/Loader'
import Layout from '../common/Layout'
import formatDate from '../../utils/formatDate'

export default class ProductsTable extends Component {
  state = {
    count: 0,
    offset: 0,
    results: [],
    isFetching: true,
    hasFetched: false,
    lastResults: []
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const { state } = this

    this.setState({ isFetching: true }, () => {
      axios
        .get(`/ajax/products/search/?skip=${state.offset}&limit=150`)
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
    const { state } = this

    return size(state.results) < state.count ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetch}
          disabled={state.isFetching}
          className="button button--outline"
        >
          {state.isFetching ? 'Loading More Products...' : 'Load More Products'}
        </button>
      </div>
    ) : null
  }

  renderRow = (product) => {
    const sid = get(product, 'sid', '')
    const name = get(product, 'name', '')
    const image = get(product, 'image', '')
    const brand = get(product, 'brand.name', '')
    const colors = map(get(product, 'colors', []), 'name')
    const createdAt = get(product, 'createdAt', (new Date()))
    const categories = map(get(product, 'categories', []), 'name')
    const spaceTypes = map(get(product, 'spaceTypes', []), 'name')

    return (
      <tr key={`product-row-${sid}`}>
        <td className="table-centered">
          {formatDate(createdAt)}
        </td>
        <td className="table-centered">
          {name}
        </td>
        <td className="table-centered">
          <a
            rel="noopener noreferrer"
            href={image}
            title={name}
            target="_blank"
          >
            <img src={image} role="presentation" title={name} />
          </a>
        </td>
        <td className="table-centered">
          {brand}
        </td>
        <td className="table-centered">
          {join(colors, ', ')}
        </td>
        <td className="table-centered">
          {join(categories, ', ')}
        </td>
        <td className="table-centered">
          {join(spaceTypes, ', ')}
        </td>
        <td className="table-actions">
          <a href={`/products/${sid}/update/`} className="button">
            Update
          </a>
        </td>
      </tr>
    )
  }

  render() {
    const { state } = this

    return (
      <Layout>
        {state.isFetching && !state.hasFetched ? (
          <div className="admin-products">
            <Loader size="52" />
          </div>
        ) : (
          <div className="admin-products">
            <Table
              items={state.results}
              count={state.count}
              headerTitle="Products"
              tableHeaders={[{
                label: 'Date Created',
                property: 'createdAt'
              }, {
                label: 'Name',
                property: 'name'
              }, {
                label: 'Image'
              }, {
                label: 'Brand',
                property: 'brand.name'
              }, {
                label: 'Colors'
              }, {
                label: 'Categories'
              }, {
                label: 'Rooms'
              }, {
                label: 'Actions'
              }]}
              searchPath="name"
              headerCtaLink="/products/add/"
              headerCtaText="Add Product"
              renderTableRow={this.renderRow}
              searchPlaceholder="Search products by name"
            />
            {this.renderPagination()}
          </div>
        )}
      </Layout>
    )
  }
}
