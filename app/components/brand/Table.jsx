import get from 'lodash/get'
import size from 'lodash/size'
import React, { Component, PropTypes as Type } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import formatDate from '../../utils/formatDate'

export default class BrandsTable extends Component {
  static propTypes = {
    brands: Type.array.isRequired
  };

  renderRow(brand) {
    const sid = get(brand, 'sid', '')
    const name = get(brand, 'name', '')
    const createdAt = get(brand, 'createdAt', (new Date()))
    const description = get(brand, 'description', '')

    return (
      <tr key={`brand-row-${sid}`}>
        <td className="table-centered">
          {formatDate(createdAt)}
        </td>
        <td className="table-centered">
          {name}
        </td>
        <td className="table-centered">
          {description}
        </td>
        <td className="table-actions">
          <a href={`/admin/brands/${sid}/update/`} className="button">
            Update
          </a>
        </td>
      </tr>
    )
  }

  render() {
    const { brands } = this.props

    return (
      <Layout>
        <Table
          items={brands}
          count={size(brands)}
          headerTitle="Brands"
          tableHeaders={[{
            label: 'Date Created',
            property: 'createdAt'
          }, {
            label: 'Name',
            property: 'name'
          }, {
            label: 'Description',
          }, {
            label: 'Actions'
          }]}
          searchPath="name"
          headerCtaLink="/admin/brands/add/"
          headerCtaText="Add Brand"
          renderTableRow={::this.renderRow}
          searchPlaceholder="Search brands by name"/>
      </Layout>
    )
  }
}
