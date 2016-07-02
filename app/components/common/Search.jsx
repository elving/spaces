import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import Select from 'react-select'
import serialize from 'form-serialize'
import upperFirst from 'lodash/upperFirst'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

import inflect from '../../utils/inflect'
import hasParent from '../../utils/dom/hasParent'
import toSingular from '../../utils/toSingular'
import csvToArray from '../../utils/csvToArray'
import withoutAnyType from '../../utils/spaceType/withoutAnyType'
import { default as $ } from '../../utils/dom/selector'

export default class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isFocused: false,
      isSearching: false,
      searchType: 'spaces',
      searchTypesAreOpen: false,
      showColors: false,
      showCategories: false,
      showSpaceTypes: false,
      filtersAreOpen: false,
      colors: '',
      spaceTypes: '',
      categories: '',
      allColors: [],
      allSpaceTypes: [],
      allCategories: []
    }

    this.form = null
    this.searchInput = null
    this.onBodyClick = event => {
      if (!hasParent(event, 'search')) {
        this.setState({
          filtersAreOpen: false,
          searchTypesAreOpen: false
        })
      }
    }
  }

  static propTypes = {
    onSearch: PropTypes.func,
    redirectOnSearch: PropTypes.bool
  };

  static defaultProps = {
    onSearch: (() => {}),
    redirectOnSearch: true
  };

  componentDidMount() {
    axios.get('/ajax/filters/').then(({ data }) => {
      this.setState({
        allColors: get(data, 'colors', []),
        allCategories: get(data, 'categories', []),
        allSpaceTypes: get(data, 'spaceTypes', [])
      })
    })
  }

  componentDidUpdate() {
    const $body = $('body')
    const { state } = this

    if (state.filtersAreOpen || state.searchTypesAreOpen) {
      $body.addEventListener('click', this.onBodyClick)
    } else {
      $body.removeEventListener('click', this.onBodyClick)
    }
  }

  search() {
    const params = serialize(this.form)
    const { props, state } = this

    if (props.redirectOnSearch) {
      window.location.href = `/search/?${params}`
    } else {
      this.setState({ isSearhing: true }, () => {
        axios
          .get(`/ajax/${state.searchType}/search/?${params}`)
          .then(({ data }) => {
            this.setState({ isSearhing: false }, () => props.onSearch(data))
          })
          .catch(() => {
            this.setState({ isSearhing: false })
          })
      })
    }
  }

  getFiltersCount() {
    const { state } = this

    return (
      size(csvToArray(state.colors)) +
      size(csvToArray(state.spaceTypes)) +
      size(csvToArray(state.categories))
    )
  }

  renderInput() {
    const { state } = this

    return (
      <div className="textfield-icon search-input-container">
        <MaterialDesignIcon name="search" className="search-input-icon"/>
        <input
          ref={input => this.searchInput = input}
          type="text"
          name={state.searchType === 'designers' ? 'username' : 'name' }
          onBlur={() => this.setState({ isFocused: false })}
          onFocus={() => this.setState({ isFocused: true })}
          disabled={state.isSearching}
          className="search-input textfield"
          placeholder="Search"/>
        {this.renderFiltersCount()}
        {this.renderSearchTypesToggle()}
        {this.renderFiltersToggle()}
      </div>
    )
  }

  renderSearchTypesToggle() {
    let icon
    const { state } = this

    if (state.searchType === 'spaces') {
      icon = 'space'
    } else if (state.searchType === 'products') {
      icon = 'product'
    } else if (state.searchType === 'designers') {
      icon = 'designer'
    } else {
      icon = 'space'
    }

    return (
      <button
        type="button"
        onClick={() => {
          this.searchInput.focus()
          this.setState({
            filtersAreOpen: false,
            searchTypesAreOpen: !state.searchTypesAreOpen
          })
        }}
        className={classNames({
          'button-unstyled': true,
          'search-type-current': true,
          'search-type-current--is-active': state.searchTypesAreOpen
        })}>
        <MaterialDesignIcon name={icon} className="search-type-current-icon"/>
      </button>
    )
  }

  renderSearchTypes() {
    const types = ['spaces', 'products', 'designers']
    const { state } = this
    const updateSearchType = searchType => {
      this.searchInput.focus()
      this.setState({
        colors: '',
        searchType,
        spaceTypes: '',
        categories: '',
        searchTypesAreOpen: false
      })
    }

    return state.searchTypesAreOpen ? (
      <div className="search-type-list">
        {map(types, type =>
          <button
            key={type}
            type="button"
            onClick={() => updateSearchType(type)}
            className={classNames({
              'button-unstyled': true,
              'search-type-item': true,
              'search-type-item--is-selected': state.searchType === type
            })}>
            <MaterialDesignIcon
              name={toSingular(type)}
              className="search-type-item-icon"/>
            <span className="search-type-item-text">
              {`Search ${upperFirst(type)}`}
            </span>
          </button>
        )}
      </div>
    ) : null
  }

  renderFiltersCount() {
    const filtersCount = this.getFiltersCount()

    return filtersCount > 0 ? (
      <span className="search-filters-count">
        {`+${filtersCount} ${inflect(filtersCount, 'filter')}`}
      </span>
    ) : null
  }

  renderFiltersToggle() {
    const { state } = this

    return (
      <button
        type="button"
        onClick={() => {
          this.searchInput.focus()
          this.setState({
            filtersAreOpen: !state.filtersAreOpen,
            searchTypesAreOpen: false
          })
        }}
        disabled={state.searchType === 'designers' || state.isSearhing}
        className={classNames({
          'button-unstyled': true,
          'search-filters-toggle': true,
          'search-filters-toggle--is-active': state.filtersAreOpen
        })}>
        <MaterialDesignIcon name="tune"/>
      </button>
    )
  }

  renderFilters() {
    const { state } = this

    return state.filtersAreOpen ? (
      <div className="search-filters">
        {state.searchType === 'spaces' ? (
          <Select
            name="spaceTypes"
            multi={true}
            value={state.spaceTypes}
            options={map(withoutAnyType(state.allSpaceTypes), type => ({
              value: get(type, 'id'),
              label: get(type, 'name')
            }))}
            onChange={spaceTypes => this.setState({ spaceTypes })}
            disabled={state.isSearhing}
            className="search-filter-input select"
            placeholder="Filter by space type"/>
        ) : null}

        {state.searchType === 'products' ? (
          <Select
            name="spaceTypes"
            multi={true}
            value={state.spaceTypes}
            options={map(state.allSpaceTypes, type => ({
              value: get(type, 'id'),
              label: get(type, 'name')
            }))}
            onChange={spaceTypes => this.setState({ spaceTypes })}
            disabled={state.isSearhing}
            className="search-filter-input select"
            placeholder="Filter by space"/>
        ) : null}

        {state.searchType === 'products' ? (
          <Select
            name="categories"
            multi={true}
            value={state.categories}
            options={map(state.allCategories, category => ({
              value: get(category, 'id'),
              label: get(category, 'name')
            }))}
            onChange={categories => this.setState({ categories })}
            disabled={state.isSearhing}
            className="search-filter-input select"
            placeholder="Filter by category"/>
        ) : null}

        {state.searchType === 'products' ? (
          <Select
            name="colors"
            multi={true}
            value={state.colors}
            options={map(state.allColors, color => ({
              value: get(color, 'id'),
              label: get(color, 'name')
            }))}
            onChange={colors => this.setState({ colors })}
            disabled={state.isSearhing}
            className="search-filter-input select"
            placeholder="Filter by color"/>
        ) : null}

        <button
          type="submit"
          className="search-filters-button button button--primary">
          {`Search ${upperFirst(state.searchType)}`}
        </button>
      </div>
    ) : null
  }

  render() {
    const { state } = this

    const onSubmit = event => {
      event.preventDefault()
      this.search()
    }

    return (
      <form
        ref={form => this.form = form}
        onSubmit={onSubmit}
        className={classNames({
          'search': true,
          'search--is-focused': (
            state.isFocused ||
            state.filtersAreOpen ||
            state.searchTypesAreOpen
          ),
          'search--has-filters': this.getFiltersCount()
        })}>
        <input type="hidden" name="type" value={state.searchType}/>

        {this.renderInput()}
        {this.renderSearchTypes()}
        {this.renderFilters()}
      </form>
    )
  }
}