import React, { Component, PropTypes } from 'react'

export default class Sticky extends Component {
  static propTypes = {
    children: PropTypes.node
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
    if (!this.originalOffsetTop) {
      return false
    }

    this.setState({
      isSticky: window.scrollY >= (this.originalOffsetTop - 5)
    })
  }

  sticky = null;
  originalOffsetTop = null;
  originalOffsetHeight = null;

  render() {
    const { props, state } = this

    return (
      <div
        ref={sticky => {
          this.sticky = sticky

          if (sticky && sticky.offsetTop && sticky.offsetHeight) {
            this.originalOffsetTop = sticky.offsetTop
            this.originalOffsetHeight = sticky.offsetHeight
          }
        }}
      >
        <div
          style={state.isSticky ? {
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            position: 'fixed'
          } : {}}
          className={state.isSticky ? 'is-sticky' : ''}
        >
          {props.children}
        </div>

        {state.isSticky ? (
          <div style={{ height: this.originalOffsetHeight }} />
        ) : null}
      </div>
    )
  }
}
