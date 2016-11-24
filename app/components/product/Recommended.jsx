import get from 'lodash/get'
import size from 'lodash/size'
import Timeago from 'timeago.js'
import React, { Component, PropTypes } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class ProductsTable extends Component {
  static propTypes = {
    products: PropTypes.array
  }

  static defaultProps = {
    products: []
  }

  renderRow = (product) => {
    const sid = get(product, 'sid', '')
    const name = get(product, 'name', '')
    const image = get(product, 'image', '')
    const createdBy = get(product, 'createdBy', {})
    const createdAt = get(product, 'createdAt', (new Date()))

    return (
      <tr key={`product-row-${sid}`}>
        <td className="table-centered">
          {new Timeago().format(createdAt)}
        </td>
        <td className="table-centered">
          <a
            rel="noopener noreferrer"
            href={`/${get(createdBy, 'detailUrl')}/`}
            target="_blank"
          >
            {get(createdBy, 'name')}
          </a>
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
        <td className="table-actions">
          <a
            href={`/products/${sid}/update/`}
            className="button button--primary-alt"
          >
            <span className="button-text">
              <MaterialDesignIcon name="review" />
              Review
            </span>
          </a>
        </td>
      </tr>
    )
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <div className="admin-products">
          <Table
            items={props.products}
            count={size(props.products)}
            headerTitle="Recommended Products"
            tableHeaders={[{
              label: 'Date Recommended',
              property: 'createdAt'
            }, {
              label: 'Recommended By',
            }, {
              label: 'Name',
              property: 'name'
            }, {
              label: 'Image'
            }, {
              label: 'Actions'
            }]}
            searchPath="name"
            renderTableRow={this.renderRow}
            searchPlaceholder="Search products by name"
          />
        </div>
      </Layout>
    )
  }
}
