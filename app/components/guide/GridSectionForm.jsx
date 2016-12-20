import map from 'lodash/map'
import omit from 'lodash/omit'
import size from 'lodash/size'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import toArray from 'lodash/toArray'
import uniqueId from 'lodash/uniqueId'
import defaultTo from 'lodash/defaultTo'
import upperFirst from 'lodash/upperFirst'
import React, { Component, PropTypes } from 'react'

import getSid from '../../api/utils/getSid'

export default class GridSectionForm extends Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.array,
    onRemove: PropTypes.func,
    modelName: PropTypes.string
  }

  static defaultProps = {
    type: 'grid',
    title: '',
    items: [],
    onRemove: (() => {})
  }

  constructor(props) {
    super(props)

    let items = {}

    forEach(props.items, item => {
      items = assign({}, items, { [uniqueId(props.id)]: item })
    })

    this.state = {
      title: defaultTo(props.title, ''),
      items: !isEmpty(items) ? items : {
        [uniqueId(props.id)]: ''
      }
    }
  }

  onTitleChange = ({ currentTarget: input }) => {
    this.setState({
      title: input.value
    })
  }

  getData = () => {
    const { props, state } = this

    return {
      type: props.type,
      title: state.title,
      items: map(toArray(state.items), getSid),
      modelName: upperFirst(props.modelName)
    }
  }

  addItem = () => {
    const { props, state } = this

    this.setState({
      items: assign({}, state.items, {
        [uniqueId(props.id)]: ''
      })
    })
  }

  updateItem = (cid, item) => {
    const { state } = this

    this.setState({
      items: assign({}, state.items, {
        [cid]: item
      })
    })
  }

  removeItem = cid => {
    const { state } = this

    this.setState({
      items: omit(state.items, [cid])
    })
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
            Section: {upperFirst(props.modelName)} Grid
          </span>
          <button
            type="button"
            onClick={this.remove}
            className="button button--danger"
          >
            Remove Section
          </button>
        </div>
        <div
          style={{
            borderBottom: '1px dashed #dadada',
            paddingBottom: 15
          }}
          className="form-group"
        >
          <input
            type="text"
            onChange={this.onTitleChange}
            className="textfield"
            placeholder="Section title"
            defaultValue={defaultTo(state.title, '')}
          />
        </div>
        {map(state.items, (item, cid) =>
          <div
            key={`${props.id}-${cid}`}
            className="form-group guide-form-section-row"
          >
            <input
              type="text"
              onChange={({ currentTarget: input }) => {
                this.updateItem(cid, input.value)
              }}
              className="textfield"
              placeholder={`${upperFirst(props.modelName)} url or short id`}
              defaultValue={defaultTo(item, '')}
            />
            {size(state.items) > 1 ? (
              <button
                type="button"
                onClick={() => this.removeItem(cid)}
                className="button button--danger"
              >
                Remove {upperFirst(props.modelName)}
              </button>
            ) : null}
          </div>
        )}
        <div className="form-group">
          <button
            type="button"
            onClick={this.addItem}
            className="button button--primary"
          >
            <span className="button-text">
              Add Another {upperFirst(props.modelName)}
            </span>
          </button>
        </div>
      </div>
    )
  }
}
