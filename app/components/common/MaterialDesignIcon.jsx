/* eslint-disable max-len */
import React, { Component, PropTypes as Type } from 'react'

export default class MaterialDesignIcon extends Component {
  static propTypes = {
    name: Type.string,
    size: Type.number,
    fill: Type.string,
    className: Type.string
  };

  static defaultProps = {
    name: '',
    size: 20,
    fill: '#999999',
    className: ''
  };

  renderIcon() {
    const { name, fill } = this.props

    switch (name) {
      case 'like': {
        return (
          <path fill={fill} className="icon-fill" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        )
      }

      case 'send': {
        return (
          <path fill={fill} className="icon-fill" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        )
      }

      case 'add': {
        return (
          <path fill={fill} className="icon-fill" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        )
      }

      case 'cancel': {
        return (
          <path fill={fill} className="icon-fill" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
        )
      }

      case 'close': {
        return (
          <path fill={fill} className="icon-fill" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        )
      }

      case 'link': {
        return (
          <path fill={fill} className="icon-fill" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        )
      }

      case 'cart': {
        return (
          <path fill={fill} className="icon-fill" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        )
      }

      case 'search': {
        return (
          <path fill={fill} className="icon-fill" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        )
      }

      case 'email': {
        return (
          <path fill={fill} className="icon-fill" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        )
      }

      case 'check': {
        return (
          <path fill={fill} className="icon-fill" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        )
      }

      case 'check-empty': {
        return (
          <path fill={fill} className="icon-fill" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        )
      }

      case 'uncheck': {
        return (
          <path fill={fill} className="icon-fill" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/>
        )
      }

      case 'redesign': {
        return (
          <path fill={fill} className="icon-fill" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
        )
      }

      case 'follow-user': {
        return (
          <path fill={fill} className="icon-fill" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        )
      }

      case 'settings': {
        return (
          <path fill={fill} className="icon-fill" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        )
      }

      case 'product': {
        return (
          <path fill={fill} className="icon-fill" d="M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-3-5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z"/>
        )
      }

      case 'comment': {
        return (
          <path fill={fill} className="icon-fill" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        )
      }

      case 'twitter': {
        return (
          <path fill={fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M15.7,7.3 C15.6,11.9 12.7,15.1 8.3,15.3 C6.5,15.4 5.2,14.8 4,14.1 C5.3,14.3 7,13.8 7.9,13 C6.6,12.9 5.8,12.2 5.4,11.1 C5.8,11.2 6.2,11.1 6.5,11.1 C5.3,10.7 4.5,10 4.4,8.4 C4.7,8.6 5.1,8.7 5.5,8.7 C4.6,8.2 4,6.3 4.7,5.1 C6,6.5 7.6,7.7 10.2,7.9 C9.5,5.1 13.3,3.6 14.8,5.5 C15.5,5.4 16,5.1 16.5,4.9 C16.3,5.6 15.9,6 15.4,6.4 C15.9,6.3 16.4,6.2 16.8,6 C16.7,6.5 16.2,6.9 15.7,7.3 L15.7,7.3 Z"/>
        )
      }

      case 'facebook': {
        return (
          <path fill={fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M17,2 L17,5 L15,5 C14.4,5 14,5.4 14,6 L14,8 L17,8 L17,11 L14,11 L14,18 L11,18 L11,11 L9,11 L9,8 L11,8 L11,5.5 C11,3.6 12.6,2 14.5,2 L17,2 L17,2 Z"/>
        )
      }

      case 'pinterest': {
        return (
          <path fill={fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M11,14.2 C10.2,14.2 9.4,13.9 8.9,13.3 L7.9,16.5 L7.8,16.7 C7.6,17 7.3,17.2 6.9,17.2 C6.3,17.2 5.8,16.7 5.8,16.1 L5.8,16 L5.8,16 L5.9,15.8 L7.7,10.2 C7.7,10.2 7.5,9.6 7.5,8.7 C7.5,7 8.4,6.5 9.2,6.5 C9.9,6.5 10.6,6.8 10.6,7.8 C10.6,9.1 9.7,9.8 9.7,10.8 C9.7,11.5 10.3,12.1 11,12.1 C13.3,12.1 14.2,10.3 14.2,8.7 C14.2,6.5 12.3,4.7 10,4.7 C7.7,4.7 5.8,6.5 5.8,8.7 C5.8,9.4 6,10 6.3,10.6 C6.4,10.8 6.4,10.9 6.4,11.1 C6.4,11.7 6,12.1 5.4,12.1 C5,12.1 4.7,11.9 4.5,11.6 C4,10.7 3.7,9.7 3.7,8.6 C3.7,5.3 6.5,2.6 9.9,2.6 C13.3,2.6 16.1,5.3 16.1,8.6 C16.2,11.4 14.6,14.2 11,14.2 L11,14.2 Z"/>
        )
      }

      case 'space-generic': {
        return (
          <path fill={fill} className="icon-fill" d="M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-3-5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z"/>
        )
      }

      default: {
        return null
      }
    }
  }

  render() {
    const { name, size, className } = this.props

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`icon icon-${name} ${className}`}
        shapeRendering="geometricPrecision"
        enableBackground="new 0 0 24 24"
        preserveAspectRatio="xMinYMin meet">
        {this.renderIcon()}
      </svg>
    )
  }
}
