import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $ */

export const TextInput = ({
  label,
  placeholder,
  handleBlur,
  required,
  handlePress,
  handleChange,
  inputId,
  value,
  tabIndex
}) => {

  const blurHandle = (e) => {
    if (required && e.target.value.length < 1) {
      $(e.target).css('border-color', 'red')
    }
    if (handleBlur) {
      handleBlur(e)
    }
  }

  const handleFocus = (e) => {
    $(e.target).css('border-color', '')
  }

  if (label.length > 0) {
    if (required) {
      required = <i className="fa fa-asterisk text-danger"></i>
    }
    label = <label htmlFor={inputId}>{label}</label>
  } else {
    label = null
  }
  return (
    <div className="form-group">
      {label}
      {required}
      <input
        type="text"
        className="form-control"
        id={inputId}
        name={inputId}
        placeholder={placeholder}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={blurHandle}
        onKeyPress={handlePress}
        value={value}
        tabIndex={tabIndex}/>
    </div>
  )
}

export class FormMixin extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.loadData()
  }

  closeForm() {
    this.setState({showForm: false})
  }

  showForm() {
    this.setState({showForm: true})
  }

  saveFailure() {
    this.setState({saveFail: true})
  }
  render() {
    return (
      <div></div>
    )
  }
}

export class sortable extends Component {
  constructor(props) {
    super(props)
  }

  fixHelper(e, ui) {
    ui.children().each(function () {
      $(this).width($(this).width())
    })
    return ui
  }

  loadSortable() {
    $(this.refs.sortRows).sortable({
      handle: '.handle',
      helper: this.fixHelper,
      cancel: '',
      update: this.updateSort,
      axis: 'y',
      containment: '#sortBox'
    }).disableSelection()
  }

  resortReact(rows, movedId, prevRowId, nextRowId) {
    let RPrev = null
    let RMoved = null
    let RNext = null
    let newRows = []
    let count = 0
    let valId = 0

    rows.forEach(function (value) {

      valId = parseInt(value.id, 10)

      if (prevRowId !== undefined && valId === prevRowId) {
        RPrev = value
      } else if (valId === movedId) {
        RMoved = value
      } else if (nextRowId !== undefined && valId === nextRowId) {
        RNext = value
      }
    })

    if (RPrev === null) {
      RMoved.sorting = 1
      count = count + 1
      newRows.push(RMoved)
    }

    rows.forEach(function (value) {
      if (RMoved.id !== value.id) {
        count = count + 1
        value.sorting = count
        newRows.push(value)
      }
      if (RPrev !== null && RPrev.id === value.id) {
        count = count + 1
        RMoved.sorting = count
        newRows.push(RMoved)
      }
    })
    return newRows
  }
}

export const PickColor = ({handleClick}) => {
  return (
    <div>
      <button className="btn btn-default" onClick={handleClick.bind(null, 'default')}>&nbsp;</button>&nbsp;
      <button className="btn btn-primary" onClick={handleClick.bind(null, 'primary')}>&nbsp;</button>&nbsp;
      <button className="btn btn-success" onClick={handleClick.bind(null, 'success')}>&nbsp;</button>&nbsp;
      <button className="btn btn-info" onClick={handleClick.bind(null, 'info')}>&nbsp;</button>&nbsp;
      <button className="btn btn-warning" onClick={handleClick.bind(null, 'warning')}>&nbsp;</button>&nbsp;
      <button className="btn btn-danger" onClick={handleClick.bind(null, 'danger')}>&nbsp;</button>
    </div>
  )
}

PickColor.propTypes = {
  handleClick: PropTypes.func
}
