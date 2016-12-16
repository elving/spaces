import defaultTo from 'lodash/defaultTo'
import React, { Component, PropTypes } from 'react'

export default class TextSectionForm extends Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string,
    onRemove: PropTypes.func
  }

  static defaultProps = {
    type: 'text',
    text: '',
    onRemove: (() => {})
  }

  constructor(props) {
    super(props)

    this.state = {
      text: defaultTo(props.text, '')
    }
  }

  onTextChange = ({ currentTarget: input }) => {
    this.setState({
      text: input.value
    })
  }

  getData = () => {
    const { props, state } = this

    return {
      type: props.type,
      text: state.text
    }
  }

  remove = () => {
    const { props } = this
    const message = 'Are you sure you want to remove this section?'

    if (window.confirm(message)) {
      props.onRemove(props.id)
    }
  }

  render() {
    const { props, state } = this

    return (
      <div className="guide-form-section form" data-type={props.type}>
        <div className="guide-form-section-header">
          <span className="guide-form-section-header-title">
            Section: Text
          </span>
          <button
            type="button"
            onClick={this.remove}
            className="button button--danger"
          >
            Remove Section
          </button>
        </div>
        <div className="form-group">
          <textarea
            name="text"
            value={defaultTo(state.text, '')}
            onChange={this.onTextChange}
            className="textfield"
            placeholder="We use wood in many different ways everyday..."
          />
        </div>
      </div>
    )
  }
}
