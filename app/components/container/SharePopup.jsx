import React, { Component } from 'react'

const SharePopupContainer = Composed => class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sharePopupIsOpen: false,
      sharePopupIsCreated: false
    }
  }

  openSharePopup() {
    this.setState({
      sharePopupIsOpen: true,
      sharePopupIsCreated: true
    })
  }

  closeSharePopup() {
    this.setState({
      sharePopupIsOpen: false
    })
  }

  render() {
    return (
      <Composed
        {...this.props}
        {...this.state}
        openSharePopup={::this.openSharePopup}
        closeSharePopup={::this.closeSharePopup}/>
    )
  }
}

export default SharePopupContainer
