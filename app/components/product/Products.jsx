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

import Loader from '../common/Loader'
import Product from './Card'
import GridCTA from '../cta/GridCTA'
import AddProductModal from '../modal/AddProduct'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import addProductModalContainer from '../container/AddProductModal'

import toStringId from '../../api/utils/toStringId'
import sortingIsValid from '../../utils/sortingIsValid'
import hasEmptyIdParam from '../../utils/hasEmptyIdParam'
import reverseKebabCase from '../../utils/reverseKebabCase'

const productSortingTypes = [{
  sort: '-likesCount -commentsCount',
  label: 'Popular'
}, {
  sort: '-createdAt',
  label: 'Newest'
}, {
  sort: 'createdAt',
  label: 'Oldest'
}, {
  sort: '-price',
  label: 'Most Expensive'
}, {
  sort: 'price',
  label: 'Least Expensive'
}]

class ProductsIndex extends Component {
  static propTypes = {
    params: PropTypes.object,
    sorting: PropTypes.string,
    products: PropTypes.object,
    emptyMessage: PropTypes.string,
    disableSorting: PropTypes.bool,
    disablePagination: PropTypes.bool,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createAddProductModal: PropTypes.bool
  }

  static defaultProps = {
    params: {},
    sorting: 'Popular',
    products: {},
    emptyMessage: 'No Products Found...',
    disableSorting: false,
    disablePagination: false,
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createAddProductModal: false
  }

  constructor(props) {
    super(props)

    const sort = reverseKebabCase(get(props, 'sorting', 'Popular'))
    const count = get(props.products, 'count', 0)
    const results = get(props.products, 'results', [])

    if (size(results) > 8) {
      results.splice(8, 0, 'cta')
    }

    this.state = {
      skip: 40,
      sort: sortingIsValid(productSortingTypes, sort) ? sort : 'Popular',
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

    if (isEmpty(props.products) && !hasEmptyIdParam(props.params)) {
      this.fetch()
    }
  }

  getSorting = label => (
    get(find(productSortingTypes, type =>
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
        .get(`/ajax/products/search/?skip=${state.offset}&${params}`)
        .then(({ data }) => {
          const results = get(data, 'results', [])
          const updatedResults = concat([], state.results, results)

          if (size(updatedResults) > 8 && !find(updatedResults, r => r === 'cta')) {
            updatedResults.splice(8, 0, 'cta')
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
            {state.isFetching
              ? 'Loading More Products...'
              : 'Load More Products'
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
          {map(productSortingTypes, type =>
            <a
              key={`product-sort-type-${type.label}`}
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

  renderProducts() {
    const { props, state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.results) &&
      isEmpty(get(props.products, 'results', []))
    )

    return (
      <div className="grid">
        {!props.disableSorting ? (
          <div className="grid-sorting">
            {this.renderSorting()}
          </div>
        ) : null}
        <div className="grid-items">
          {hasNoResults ? (
            <p className="grid-items-empty">
              {props.emptyMessage}
            </p>
          ) : (
            map(state.results, product => {
              if (product === 'cta') {
                return (
                  <GridCTA />
                )
              }

              return (
                <Product
                  {...product}
                  key={`${state.sort}-${toStringId(product)}`}
                  onAddButtonClick={() => props.openAddProductModal(product)}
                />
              )
            })
          )}
        </div>
      </div>
    )
  }

  render() {
    const { props, state } = this

    return state.isFetching && !state.hasFetched ? (
      <div className="grids">
        <Loader size="52" />
      </div>
    ) : (
      <div className="grids">
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
        />

        {this.renderProducts()}
        {this.renderPagination()}
      </div>
    )
  }
}

export default addProductModalContainer(ProductsIndex)
