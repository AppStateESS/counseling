'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $, settingsAllowed */

export default class LocationRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      title: '',
      active: '1'
    }
    this.saveTitle = this.saveTitle.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.deleteLocation = this.deleteLocation.bind(this)
    this.resetTitle = this.resetTitle.bind(this)
  }

  componentDidMount() {
    this.setState(this.props)
  }

  deleteLocation() {
    $.post('counseling/Admin/Settings/Location', {
      command: 'delete',
      locationId: this.state.id
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  updateTitle(event) {
    this.setState({title: event.target.value})
  }

  resetTitle() {
    this.setState({title: this.props.title})
  }

  saveTitle() {
    if (this.state.title === null || this.state.title.length === 0) {
      return
    }
    $.post('counseling/Admin/Settings/Location', {
      command: 'setTitle',
      locationId: this.state.id,
      title: this.state.title
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  render() {
    let deleteButton = null
    if (settingsAllowed) {
      deleteButton = <button
        className="btn btn-danger btn-sm"
        onClick={this.deleteLocation}>
        <i className="fa fa-exclamation-triangle"></i>
        Delete</button>
    }

    let props = {
      locationId: this.state.id,
      reload: this.props.reload,
      currentEdit: this.props.currentEdit,
      setCurrentEdit: this.props.setCurrentEdit
    }

    return (
      <tr>
        <td style={{width : '5%'}}>
          {deleteButton}
        </td>
        <td>
          <LocationTitle
            value={this.state.title}
            reset={this.resetTitle}
            update={this.updateTitle}
            save={this.saveTitle}
            {...props}/>
        </td>
      </tr>
    )
  }
}

LocationRow.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  active: PropTypes.string,
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func
}

const LocationTitle = (props) => {
  return (<LocationValue
    {...props}
    placeholder="One or two words describing location."
    section="1"/>)
}

class LocationValue extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
    this.openInput = this.openInput.bind(this)
    this.save = this.save.bind(this)
    this.closeInput = this.closeInput.bind(this)
  }

  closeInput() {
    this.setState({editMode: false})
    this.props.reset()
  }

  componentDidUpdate() {
    $('.editItem').focus()
  }

  openInput() {
    this.props.setCurrentEdit(this.props.locationId, this.props.section)
    this.setState({editMode: true})
  }

  save() {
    this.setState({editMode: false})
    this.props.save()
  }

  render() {
    var value = null

    if (this.state.editMode && this.props.currentEdit.id == this.props.locationId && this.props.currentEdit.section == this.props.section) {
      value = (<LineEdit
        placeholder={this.props.placeholder}
        update={this.props.update}
        value={this.props.value}
        close={this.closeInput}
        save={this.save}/>)
    } else {
      value = (
        <div className="editItem" onClick={this.openInput} title="Click to edit">{this.props.value}</div>
      )
    }

    return (
      <div>{value}</div>
    )
  }
}

LocationValue.propTypes = {
  value: PropTypes.string,
  locationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string,]),
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func,
  update: PropTypes.func,
  save: PropTypes.func,
  placeholder: PropTypes.string,
  section: PropTypes.string,
  reset: PropTypes.func
}

const LineEdit = ({placeholder, close, update, save, value}) => {
  let mouseFlag = false

  const blurEvent = () => {
    if (mouseFlag === false) {
      close()
    }
  }

  const flagMouseOn = () => {
    mouseFlag = true
  }

  const flagMouseOff = () => {
    mouseFlag = false
  }

  return (
    <div className="input-group">
      <input
        type="text"
        className="editItem form-control"
        placeholder={placeholder}
        onChange={update}
        value={value}
        onBlur={blurEvent}/>
      <span className="input-group-btn">
        <button
          className="btn btn-success"
          onClick={save}
          onMouseDown={flagMouseOn}
          onMouseUp={flagMouseOff}>
          <i className="fa fa-check"></i>
        </button>
        <button className="btn btn-danger" onClick={close}>
          <i className="fa fa-times"></i>
        </button>
      </span>
    </div>
  )
}

LineEdit.propTypes = {
  placeholder: PropTypes.string,
  close: PropTypes.func,
  update: PropTypes.func,
  save: PropTypes.func,
  value: PropTypes.string,
}
