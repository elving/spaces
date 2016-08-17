import map from 'lodash/map'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

import getTags from '../../utils/getTags'
import toStringId from '../../api/utils/toStringId'

export default class CardTags extends Component {
  static propTypes = {
    model: PropTypes.object,
    className: PropTypes.string,
    autoScroll: PropTypes.bool,
    forDisplayOnly: PropTypes.bool
  }

  static defaultProps = {
    model: {},
    className: '',
    autoScroll: false,
    forDisplayOnly: false
  }

  state = {
    isHovering: false
  }

  componentWillReceiveProps(nextProps) {
    const { state } = this

    if (nextProps.autoScroll && this.container && !state.isHovering) {
      this.setInterval()
    } else {
      this.clearInterval()
    }
  }

  componentWillUnmount() {
    this.clearInterval()
  }

  onMouseEnter = () => {
    this.clearInterval()

    this.setState({
      isHovering: true
    })
  }

  onMouseLeave = () => {
    const { props } = this

    this.setState({
      isHovering: false
    })

    if (props.autoScroll) {
      this.setInterval()
    }
  }

  setInterval = () => {
    this.clearInterval()

    this.lastScrollLeft = this.container.scrollLeft

    this.scrollInterval = setInterval(() => {
      const scrollLeft = this.container.scrollLeft
      const scrollWidth = this.container.scrollWidth
      const offsetWidth = this.container.offsetWidth
      const currentScroll = scrollWidth - offsetWidth
      const { scrollingBack, lastScrollLeft } = this

      if (!scrollingBack && lastScrollLeft < currentScroll) {
        this.lastScrollLeft += 1
      } else if (lastScrollLeft === 0) {
        this.scrollingBack = false
        this.lastScrollLeft += 1
      } else if (scrollingBack) {
        this.lastScrollLeft -= 1
      } else if (scrollLeft === currentScroll) {
        this.scrollingBack = true
        this.lastScrollLeft -= 1
      }

      this.container.scrollLeft = this.lastScrollLeft
    }, 25)
  }

  clearInterval = () => {
    clearInterval(this.scrollInterval)
  }

  container = null
  scrollingBack = false
  lastScrollLeft = 0
  scrollInterval = null

  render() {
    const { props } = this

    return (
      <div
        ref={container => { this.container = container }}
        className={`${props.className} card-tags`}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {map(getTags(props.model), tag => (
          props.forDisplayOnly ? (
            <span
              key={`${toStringId(props.model)}-${tag.id}`}
              className="card-tag"
            >
              <MaterialDesignIcon name={tag.type} size={12} />
              {tag.name}
            </span>
          ) : (
            <a
              key={`${toStringId(props.model)}-${tag.id}`}
              href={tag.url}
              className="card-tag"
            >
              <MaterialDesignIcon name={tag.type} size={12} />
              {tag.name}
            </a>
          )
        ))}
      </div>
    )
  }
}
