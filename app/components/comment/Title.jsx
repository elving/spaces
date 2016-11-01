import map from 'lodash/map'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import inflect from '../../utils/inflect'

export default class CommentsList extends Component {
  static contextTypes = {
    onCommentsSorted: PropTypes.func
  }

  static propTypes = {
    count: PropTypes.number,
    isFetching: PropTypes.bool,
    hasSortableComments: PropTypes.bool
  }

  static defaultProps = {
    count: 0,
    isFetching: false,
    hasSortableComments: false
  }

  state = {
    currentSorting: 'Newest'
  }

  sort = sorting => {
    const { state, context, sortingDropdown } = this

    event.preventDefault()
    sortingDropdown.hide()

    if (state.currentSorting === sorting) {
      return
    }

    this.setState({
      currentSorting: sorting
    }, () => {
      context.onCommentsSorted(sorting)
    })
  }

  renderSorting() {
    const { state } = this
    const sortingTypes = ['Newest', 'Oldest']

    return (
      <Dropdown
        ref={sortingDropdown => { this.sortingDropdown = sortingDropdown }}
        className="dropdown comments-sorting"
        data-sorting={state.currentSorting}
      >
        <DropdownTrigger className="dropdown-trigger">
          Sort by {state.currentSorting}
        </DropdownTrigger>
        <DropdownContent className="dropdown-content">
          {map(sortingTypes, type =>
            <a
              key={`comment-sort-type-${type}`}
              href={`#${type}`}
              onClick={event => {
                event.preventDefault()
                this.sort(type)
              }}
              className={classNames({
                'dropdown-link': true,
                'dropdown-link--active': type === state.currentSorting
              })}
            >
              {type}
            </a>
          )}
        </DropdownContent>
      </Dropdown>
    )
  }

  renderText() {
    const { props } = this

    if (props.count) {
      return `${props.count} ${inflect(props.count, 'Comment')}`
    }

    return 'No comments yet'
  }

  render() {
    const { props } = this

    return (
      <div className="comments-header">
        <div className="comments-title">
          {props.isFetching ? (
            'Fetching comments...'
          ) : (
            this.renderText()
          )}
        </div>
        {props.hasSortableComments ? (
          this.renderSorting()
        ) : null}
      </div>
    )
  }
}
