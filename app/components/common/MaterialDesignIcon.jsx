/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react'

export default class MaterialDesignIcon extends Component {
  static propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    name: '',
    size: 20,
    fill: '#999999',
    style: {},
    className: ''
  }

  renderIcon() {
    const { props } = this

    switch (props.name) {
      case 'help': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        )
      }

      case 'public': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        )
      }

      case 'private': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
        )
      }

      case 'back': {
        return (
          <g>
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill={props.fill} className="icon-fill" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </g>
        )
      }

      case 'verified': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        )
      }

      case 'build': {
        return (
          <path fill={props.fill} className="icon-fill" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
        )
      }

      case 'open': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
        )
      }

      case 'profile': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 12.25c1.24 0 2.25-1.01 2.25-2.25S13.24 7.75 12 7.75 9.75 8.76 9.75 10s1.01 2.25 2.25 2.25zm4.5 4c0-1.5-3-2.25-4.5-2.25s-4.5.75-4.5 2.25V17h9v-.75zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
        )
      }

      case 'logout': {
        return (
          <path fill={props.fill} className="icon-fill" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        )
      }

      case 'edit': {
        return (
          <path fill={props.fill} className="icon-fill" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        )
      }

      case 'delete': {
        return (
          <path fill={props.fill} className="icon-fill" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        )
      }

      case 'like': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        )
      }

      case 'send': {
        return (
          <path fill={props.fill} className="icon-fill" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        )
      }

      case 'add': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        )
      }

      case 'add-alt': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        )
      }

      case 'add-product': {
        return (
          <g>
            <path fill={props.fill} className="icon-fill" d="M14,0.01 L2,0 C0.9,0 0,0.89 0,2 L0,18 C0,19.1 0.9,20 2,20 L14,20 C15.1,20 16,19.1 16,18 L16,2 C16,0.89 15.1,0.01 14,0.01 Z M14,18 L2,18 L2,8.98 L14,8.98 L14,18 Z M14,7 L2,7 L2,2 L14,2 L14,7 Z M4,3 L6,3 L6,6 L4,6 L4,3 Z M4,10 L6,10 L6,15 L4,15 L4,10 Z" />
            <circle fill="#2ecc71" cx="16" cy="16" r="10" />
            <path fill={props.fill} className="icon-fill" transform="scale(0.75) translate(8.5, 8.5)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </g>
        )
      }

      case 'remove': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19 13H5v-2h14v2z" />
        )
      }

      case 'cancel': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
        )
      }

      case 'close': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        )
      }

      case 'link': {
        return (
          <path fill={props.fill} className="icon-fill" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
        )
      }

      case 'cart': {
        return (
          <path fill={props.fill} className="icon-fill" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        )
      }

      case 'search': {
        return (
          <path fill={props.fill} className="icon-fill" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        )
      }

      case 'image': {
        return (
          <path fill={props.fill} className="icon-fill" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        )
      }

      case 'email': {
        return (
          <path fill={props.fill} className="icon-fill" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        )
      }

      case 'check-simple': {
        return (
          <path fill={props.fill} className="icon-fill" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        )
      }

      case 'check': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        )
      }

      case 'check-empty': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        )
      }

      case 'uncheck': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
        )
      }

      case 'redesign': {
        return (
          <path fill={props.fill} className="icon-fill" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
        )
      }

      case 'follow': {
        return (
          <path fill={props.fill} className="icon-fill" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        )
      }

      case 'unfollow': {
        return (
          <path fill={props.fill} className="icon-fill" d="M15,12 C17.21,12 19,10.21 19,8 C19,5.79 17.21,4 15,4 C12.79,4 11,5.79 11,8 C11,10.21 12.79,12 15,12 L15,12 Z M4,10 L1,10 L1,12 L4,12 L6,12 L9,12 L9,10 L6,10 L4,10 Z M15,14 C12.33,14 7,15.34 7,18 L7,20 L23,20 L23,18 C23,15.34 17.67,14 15,14 L15,14 Z" />
        )
      }

      case 'settings': {
        return (
          <path fill={props.fill} className="icon-fill" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        )
      }

      case 'comment': {
        return (
          <path fill={props.fill} className="icon-fill" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        )
      }

      case 'space': {
        return (
          <path fill={props.fill} className="icon-fill" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        )
      }

      case 'product': {
        return (
          <path fill={props.fill} className="icon-fill" d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6v-9.02h12V20zm0-11H6V4h12v5zM8 5h2v3H8zm0 7h2v5H8z" />
        )
      }

      case 'user': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        )
      }

      case 'caret-down': {
        return (
          <path fill={props.fill} className="icon-fill" d="M7 10l5 5 5-5z" />
        )
      }

      case 'caret-up': {
        return (
          <path fill={props.fill} className="icon-fill" d="M7 14l5-5 5 5z" />
        )
      }

      case 'caret-left': {
        return (
          <path fill={props.fill} className="icon-fill" d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
        )
      }

      case 'caret-right': {
        return (
          <path fill={props.fill} className="icon-fill" d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
        )
      }

      case 'arrow-down': {
        return (
          <path fill={props.fill} className="icon-fill" d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
        )
      }

      case 'category': {
        return (
          <path fill={props.fill} className="icon-fill" d="M2.53 19.65l1.34.56v-9.03l-2.43 5.86c-.41 1.02.08 2.19 1.09 2.61zm19.5-3.7L17.07 3.98c-.31-.75-1.04-1.21-1.81-1.23-.26 0-.53.04-.79.15L7.1 5.95c-.75.31-1.21 1.03-1.23 1.8-.01.27.04.54.15.8l4.96 11.97c.31.76 1.05 1.22 1.83 1.23.26 0 .52-.05.77-.15l7.36-3.05c1.02-.42 1.51-1.59 1.09-2.6zM7.88 8.75c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2 11c0 1.1.9 2 2 2h1.45l-3.45-8.34v6.34z" />
        )
      }

      case 'color': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        )
      }

      case 'spaceType': {
        return (
          <path fill={props.fill} className="icon-fill" d="M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-3-5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z" />
        )
      }

      case 'tune': {
        return (
          <path fill={props.fill} className="icon-fill" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
        )
      }

      case 'list': {
        return (
          <path fill={props.fill} className="icon-fill" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        )
      }

      case 'menu': {
        return (
          <path fill={props.fill} className="icon-fill" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        )
      }

      case 'star': {
        return (
          <path fill={props.fill} className="icon-fill" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
        )
      }

      case 'sort': {
        return (
          <path fill={props.fill} className="icon-fill" d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
        )
      }

      case 'cards': {
        return (
          <path fill={props.fill} className="icon-fill" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        )
      }

      case 'recommend': {
        return (
          <g>
            <circle fill={props.fill} className="icon-fill" cx="9" cy="9" r="4" />
            <path fill={props.fill} className="icon-fill" d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64l-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z" />
          </g>
        )
      }

      case 'review': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 6c0-.55-.45-1-1-1H5.82l.66-3.18.02-.23c0-.31-.13-.59-.33-.8L5.38 0 .44 4.94C.17 5.21 0 5.59 0 6v6.5c0 .83.67 1.5 1.5 1.5h6.75c.62 0 1.15-.38 1.38-.91l2.26-5.29c.07-.17.11-.36.11-.55V6zm10.5 4h-6.75c-.62 0-1.15.38-1.38.91l-2.26 5.29c-.07.17-.11.36-.11.55V18c0 .55.45 1 1 1h5.18l-.66 3.18-.02.24c0 .31.13.59.33.8l.79.78 4.94-4.94c.27-.27.44-.65.44-1.06v-6.5c0-.83-.67-1.5-1.5-1.5z" />
        )
      }

      case 'approve': {
        return (
          <path fill={props.fill} className="icon-fill" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
        )
      }

      case 'disapprove': {
        return (
          <path fill={props.fill} className="icon-fill" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
        )
      }

      case 'notifications': {
        return (
          <path fill={props.fill} className="icon-fill" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        )
      }

      case 'notifications-active': {
        return (
          <path fill={props.fill} className="icon-fill" d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z" />
        )
      }

      case 'guide': {
        return (
          <path fill={props.fill} className="icon-fill" d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
        )
      }

      case 'twitter': {
        return (
          <path fill={props.fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M15.7,7.3 C15.6,11.9 12.7,15.1 8.3,15.3 C6.5,15.4 5.2,14.8 4,14.1 C5.3,14.3 7,13.8 7.9,13 C6.6,12.9 5.8,12.2 5.4,11.1 C5.8,11.2 6.2,11.1 6.5,11.1 C5.3,10.7 4.5,10 4.4,8.4 C4.7,8.6 5.1,8.7 5.5,8.7 C4.6,8.2 4,6.3 4.7,5.1 C6,6.5 7.6,7.7 10.2,7.9 C9.5,5.1 13.3,3.6 14.8,5.5 C15.5,5.4 16,5.1 16.5,4.9 C16.3,5.6 15.9,6 15.4,6.4 C15.9,6.3 16.4,6.2 16.8,6 C16.7,6.5 16.2,6.9 15.7,7.3 L15.7,7.3 Z" />
        )
      }

      case 'facebook': {
        return (
          <path fill={props.fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M17,2 L17,5 L15,5 C14.4,5 14,5.4 14,6 L14,8 L17,8 L17,11 L14,11 L14,18 L11,18 L11,11 L9,11 L9,8 L11,8 L11,5.5 C11,3.6 12.6,2 14.5,2 L17,2 L17,2 Z" />
        )
      }

      case 'pinterest': {
        return (
          <path fill={props.fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M11,14.2 C10.2,14.2 9.4,13.9 8.9,13.3 L7.9,16.5 L7.8,16.7 C7.6,17 7.3,17.2 6.9,17.2 C6.3,17.2 5.8,16.7 5.8,16.1 L5.8,16 L5.8,16 L5.9,15.8 L7.7,10.2 C7.7,10.2 7.5,9.6 7.5,8.7 C7.5,7 8.4,6.5 9.2,6.5 C9.9,6.5 10.6,6.8 10.6,7.8 C10.6,9.1 9.7,9.8 9.7,10.8 C9.7,11.5 10.3,12.1 11,12.1 C13.3,12.1 14.2,10.3 14.2,8.7 C14.2,6.5 12.3,4.7 10,4.7 C7.7,4.7 5.8,6.5 5.8,8.7 C5.8,9.4 6,10 6.3,10.6 C6.4,10.8 6.4,10.9 6.4,11.1 C6.4,11.7 6,12.1 5.4,12.1 C5,12.1 4.7,11.9 4.5,11.6 C4,10.7 3.7,9.7 3.7,8.6 C3.7,5.3 6.5,2.6 9.9,2.6 C13.3,2.6 16.1,5.3 16.1,8.6 C16.2,11.4 14.6,14.2 11,14.2 L11,14.2 Z" />
        )
      }

      default: {
        return null
      }
    }
  }

  render() {
    const { props } = this

    return (
      <svg
        style={props.style}
        width={props.size}
        height={props.size}
        viewBox="0 0 24 24"
        className={`icon icon-${props.name} ${props.className}`}
        shapeRendering="geometricPrecision"
        enableBackground="new 0 0 24 24"
        preserveAspectRatio="xMinYMin meet"
      >
        {this.renderIcon()}
      </svg>
    )
  }
}
