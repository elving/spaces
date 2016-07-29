import React, { Component, PropTypes } from 'react'

export default class Sticky extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  constructor(props) {
    super(props)

    this.state = {
      isSticky: false
    }

    this.sticky = null
    this.originalOffsetTop = null
    this.originalOffsetHeight = null

    this.onScroll = () => {
      if (!this.originalOffsetTop) {
        return false
      }

      this.setState({
        isSticky: window.scrollY >= (this.originalOffsetTop - 5)
      })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

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
