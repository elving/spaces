import get from 'lodash/get'
import size from 'lodash/size'
import React, { Component, PropTypes as Type } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import formatDate from '../../utils/formatDate'

export default class CategoriesTable extends Component {
  static propTypes = {
    categories: Type.array.isRequired
  };

  renderRow(category) {
    const sid = get(category, 'sid', '')
    const name = get(category, 'name', '')
    const createdAt = get(category, 'createdAt', (new Date()))

    return (
      <tr key={`category-row-${sid}`}>
        <td className="table-centered">
          {formatDate(createdAt)}
        </td>
        <td className="table-centered">
          {name}
        </td>
        <td className="table-actions">
          <a href={`/admin/categories/${sid}/update/`} className="button">
            Update
          </a>
        </td>
      </tr>
    )
  }

  render() {
    const { categories } = this.props

    return (
      <Layout>
        <Table
          items={categories}
          count={size(categories)}
          headerTitle="Categories"
          tableHeaders={[{
            label: 'Date Created',
            property: 'createdAt'
          }, {
            label: 'Name',
            property: 'name'
          }, {
            label: 'Actions'
          }]}
          searchPath="name"
          headerCtaLink="/admin/categories/add/"
          headerCtaText="Add Category"
          renderTableRow={::this.renderRow}
          searchPlaceholder="Search categories by name"/>
      </Layout>
    )
  }
}
