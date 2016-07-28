import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import Select from 'react-select'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import parseInt from 'lodash/parseInt'
import serialize from 'form-serialize'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'

import toStringId from '../../api/utils/toStringId'
import withoutAnyType from '../../utils/spaceType/withoutAnyType'

export default class ProductSearchForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      brands: [],
      colors: [],
      categories: [],
      spaceTypes: [],

      skip: 0,
      errors: {},
      allResults: [],
      lastResults: [],

      lastSearch: '',
      isSearhing: false,
      hasSearched: false,
      searchSuccessful: false,

      showBrands: false,
      showColors: false,
      showCategories: false,
      showSpaceTypes: false
    }

    this.form = null
    this.nameInput = null
    this.triggerSearch = () => {
      this.search()
    }
  }

  static propTypes = {
    brands: Type.array,
    colors: Type.array,
    onClear: Type.func,
    onSearch: Type.func,
    categories: Type.array,
    spaceTypes: Type.array
  };

  static defaultProps = {
    brands: [],
    colors: [],
    onClear: (() => {}),
    onSearch: (() => {}),
    categories: [],
    spaceTypes: []
  };

  search(params) {
    params = !isEmpty(params) ? params : serialize(this.form)
    const { onSearch } = this.props
    const { skip, allResults } = this.state

    this.setState({
      errors: {},
      lastSearch: params,
      isSearhing: true
    }, () => {
      axios({
        url: `/ajax/products/search/?${params}`,
        method: 'get'
      }).then((res) => {
        const newResults = parseInt(skip) > 0
          ? concat(allResults, get(res, 'data', []))
          : get(res, 'data', [])

        this.setState({
          skip: size(newResults) > 30 ? size(newResults) : 0,
          errors: {},
          allResults: newResults,
          isSearhing: false,
          hasSearched: true,
          lastResults: get(res, 'data', []),
          searchSuccessful: true
        }, () => onSearch({
          allResults: newResults,
          lastResults: get(res, 'data', [])
        }))
      }).catch(({ response }) => {
        this.setState({
          skip: 0,
          errors: get(response, 'data.err', {}),
          allResults: [],
          isSearhing: false,
          hasSearched: true,
          lastResults: [],
          searchSuccessful: false
        })
      })
    })
  }

  onSubmit(event) {
    const formData = serialize(this.form)
    const { lastSearch } = this.state

    event.preventDefault()

    if (isEqual(lastSearch, formData)) {
      return
    } else {
      this.setState({
        skip: 0,
        allResults: [],
        lastResults: [],
      }, () => this.search(formData))
    }
  }

  onClickClear() {
    const { onClear } = this.props

    this.setState({
      name: '',
      brands: [],
      colors: [],
      categories: [],
      spaceTypes: [],

      skip: 0,
      errors: {},
      allResults: [],
      lastResults: [],

      lastSearch: '',
      isSearhing: false,
      hasSearched: false,
      searchSuccessful: false
    }, () => {
      onClear()
      this.nameInput.focus()
    })
  }

  render() {
    const {
      skip,
      isSearhing,
      showBrands,
      showColors,
      showCategories,
      showSpaceTypes
    } = this.state

    const showTogglers = (
      !showBrands ||
      !showColors ||
      !showCategories ||
      !showSpaceTypes
    )

    return (
      <form
        ref={(form) => this.form = form}
        onSubmit={::this.onSubmit}
        className="search-form form">
        <input type="hidden" name="skip" value={skip}/>

        <div className="search-form-input-container textfield-icon">
          <Icon name="search"/>
          <input
            ref={(input) => this.nameInput = input}
            name="name"
            value={get(this.state, 'name', '')}
            onChange={(event) => {
              this.setState({ name: event.currentTarget.value })
            }}
            disabled={isSearhing}
            autoFocus
            className="textfield search-form-input"
            placeholder="Search products by name"/>
        </div>

        <div className="search-form-controls">
          {showTogglers ? (
            <div className="form-group">
              <div className="search-form-togglers">
                {!showCategories ? (
                  <button
                    type="button"
                    onClick={() => this.setState({ showCategories: true })}
                    className="button button--link search-form-toggle">
                    <Icon name="tag"/> By categories
                  </button>
                ) : null}

                {!showColors ? (
                  <button
                    type="button"
                    onClick={() => this.setState({ showColors: true })}
                    className="button button--link search-form-toggle">
                    <Icon name="circle"/> By colors
                  </button>
                ) : null}

                {!showBrands ? (
                  <button
                    type="button"
                    onClick={() => this.setState({ showBrands: true })}
                    className="button button--link search-form-toggle">
                    <Icon name="star"/> By brands
                  </button>
                ) : null}

                {!showSpaceTypes ? (
                  <button
                    type="button"
                    onClick={() => this.setState({ showSpaceTypes: true })}
                    className="button button--link search-form-toggle">
                    <Icon name="home"/> By types of space
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {showCategories ? (
            <div className="form-group">
              <Select
                name="categories"
                multi={true}
                value={get(this.state, 'categories', '')}
                options={map(this.props.categories, (category) => ({
                  value: toStringId(category),
                  label: get(category, 'name')
                }))}
                onChange={(categories) => this.setState({ categories })}
                disabled={isSearhing}
                className="select"
                placeholder="Filter by category"/>
            </div>
          ) : null}

          {showColors ? (
            <div className="form-group">
              <Select
                name="colors"
                multi={true}
                value={get(this.state, 'colors', '')}
                options={map(this.props.colors, (color) => ({
                  value: toStringId(color),
                  label: get(color, 'name')
                }))}
                onChange={(colors) => this.setState({ colors })}
                disabled={isSearhing}
                className="select"
                placeholder="Filter by color"/>
            </div>
          ) : null}

          {showBrands ? (
            <div className="form-group">
              <Select
                name="brands"
                multi={true}
                value={get(this.state, 'brands', '')}
                options={map(this.props.brands, (brand) => ({
                  value: toStringId(brand),
                  label: get(brand, 'name')
                }))}
                onChange={(brands) => this.setState({ brands })}
                disabled={isSearhing}
                className="select"
                placeholder="Filter by brand"/>
            </div>
          ) : null}

          {showSpaceTypes ? (
            <div className="form-group">
              <Select
                name="spaceTypes"
                multi={true}
                value={get(this.state, 'spaceTypes', '')}
                options={map(withoutAnyType(this.props.spaceTypes), (type) => ({
                  value: toStringId(type),
                  label: get(type, 'name')
                }))}
                onChange={(spaceTypes) => this.setState({ spaceTypes })}
                disabled={isSearhing}
                className="select"
                placeholder="Filter by space"/>
            </div>
          ) : null}

          <div className="form-group">
            <div className="form-group form-group--inline">
              <button
                type="submit"
                className="button button--primary">
                <span className="button-text">
                  {isSearhing ? 'Searching...' : 'Search'}
                </span>
              </button>
              <button
                type="button"
                onClick={::this.onClickClear}
                className="button">
                <span className="button-text">Clear</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
