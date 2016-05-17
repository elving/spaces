import map from 'lodash/map'
import get from 'lodash/get'
import join from 'lodash/join'
import size from 'lodash/size'
import React, { Component, PropTypes as Type } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import formatDate from '../../utils/formatDate'

export default class ProductsTable extends Component {
  static propTypes = {
    products: Type.array.isRequired
  };

  renderRow(product) {
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
          <a href={image} title={name} target="_blank">
            <img src={image} title={name}/>
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
    const { products } = this.props

    return (
      <Layout>
        <Table
          items={products}
          count={size(products)}
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
            label: 'Space Types'
          }, {
            label: 'Actions'
          }]}
          searchPath="name"
          headerCtaLink="/products/add/"
          headerCtaText="Add Product"
          renderTableRow={::this.renderRow}
          searchPlaceholder="Search products by name"/>
      </Layout>
    )
  }
}
