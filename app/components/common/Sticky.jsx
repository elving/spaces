import get from 'lodash/get'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

export default class Sticky extends Component {
  static propTypes = {
    offset: PropTypes.number,
    children: PropTypes.node
  }

  static defaultProps = {
    offset: 5
  }

  state = {
    isSticky: false
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  onScroll = () => {
    const { props } = this

    if (!this.sticky) {
      return false
    }

    const offsetTop = get(this.sticky, 'offsetTop', 0)

    const offset = props.offset >= offsetTop
      ? props.offset - offsetTop
      : offsetTop - props.offset

    this.setState({
      isSticky: window.scrollY >= offset
    })
  }

  sticky = null
  originalOffsetTop = null
  originalOffsetHeight = null

  render() {
    const { props, state } = this

    return (
      <div
        ref={sticky => {
          this.sticky = sticky

          if (sticky) {
            this.originalOffsetTop = sticky.offsetTop
            this.originalOffsetHeight = sticky.offsetHeight
          }
        }}
        className="sticky"
      >
        <div
          style={state.isSticky ? {
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1001,
            position: 'fixed'
          } : {}}
          className={classNames({
            'sticky-inner': true,
            'sticky-inner--active': state.isSticky
          })}
        >
          {props.children}
        </div>

        {state.isSticky ? (
          <div
            style={{ height: this.originalOffsetHeight }}
            className="sticky-placeholder"
          />
        ) : null}
      </div>
    )
  }
}
