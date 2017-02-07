import React from 'react'
import Modal from 'react-modal'
import ReactDOM from 'react-dom'
import { Router, browserHistory as history } from 'react-router'

import './styles/index.css'
import routes from './routes/client'

const createElement = (Component, props) => {
  const serverProps = window.__REACT_PROPS__ || {}

  return (
    <Component {...props} {...serverProps} />
  )
}

const render = () => {
  Modal.setAppElement('#app')

  ReactDOM.render((
    <Router
      history={history}
      createElement={createElement}
    >
      {routes}
    </Router>
  ), document.querySelector('#app'))
}

if (document.readyState !== 'loading') {
  render()
} else {
  document.addEventListener('DOMContentLoaded', render)
}
