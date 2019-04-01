'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {PickColor} from '../Mixins'

/* global $, settingsAllowed */

export default class ReasonRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      title: '',
      description: '',
      instruction: '',
      show_emergency: true,
      category: 0,
      ask_for_phone: false,
      active: true,
      sorting: 0,
      color: 'default'
    }
    this.saveTitle = this.saveTitle.bind(this)
    this.pickColor = this.pickColor.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.deleteReason = this.deleteReason.bind(this)
    this.flipEmergency = this.flipEmergency.bind(this)
    this.flipAskForPhone = this.flipAskForPhone.bind(this)
  }

  componentDidMount() {
    this.setState(this.props)
  }

  flipEmergency() {
    $.post('counseling/Admin/Settings/Reason', {
      command: 'flipEmergency',
      reasonId: this.state.id
    }, null, 'json').done(function () {
      let switcher = this.state.show_emergency == '1'
        ? '0'
        : '1'
      this.setState({show_emergency: switcher})
    }.bind(this))
  }

  flipAskForPhone() {
    $.post('counseling/Admin/Settings/Reason', {
      command: 'flipAskForPhone',
      reasonId: this.state.id
    }, null, 'json').done(function () {
      let switcher = this.state.ask_for_phone == '1'
        ? '0'
        : '1'
      this.setState({ask_for_phone: switcher})
    }.bind(this))
  }

  pickColor(value) {
    this.setState({color: value})
    $.post('counseling/Admin/Settings/Reason', {
      command: 'pickColor',
      reasonId: this.state.id,
      color: value,
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  deleteReason() {
    $.post('counseling/Admin/Settings/Reason', {
      command: 'delete',
      reasonId: this.state.id
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  updateTitle(event) {
    this.setState({title: event.target.value})
  }

  updateDescription(event) {
    this.setState({description: event.target.value})
  }

  updateInstruction(event) {
    this.setState({instruction: event.target.value})
  }

  updateCategory(event) {
    this.setState({category: event.target.value})
  }

  resetTitle() {
    this.setState({title: this.props.title})
  }

  resetDescription() {
    this.setState({description: this.props.description})
  }

  resetInstruction() {
    this.setState({instruction: this.props.instruction})
  }

  resetCategory() {
    this.setState({category: this.props.category})
  }

  saveTitle() {
    if (this.state.title === null || this.state.title.length === 0) {
      return
    }
    $.post('counseling/Admin/Settings/Reason', {
      command: 'setTitle',
      reasonId: this.state.id,
      title: this.state.title
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  saveDescription() {
    if (this.state.description === null || this.state.description.length === 0) {
      return
    }
    $.post('counseling/Admin/Settings/Reason', {
      command: 'setDescription',
      reasonId: this.state.id,
      description: this.state.description
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  saveInstruction() {
    if (this.state.instruction === null || this.state.instruction.length === 0) {
      return
    }
    $.post('counseling/Admin/Settings/Reason', {
      command: 'setInstruction',
      reasonId: this.state.id,
      instruction: this.state.instruction
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  saveCategory() {
    if (this.state.category === null || this.state.category.length === 0) {
      return
    }
    $.post('counseling/Admin/Settings/Reason', {
      command: 'setCategory',
      reasonId: this.state.id,
      category: this.state.category
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  render() {
    let deleteButton = null
    if (settingsAllowed) {
      deleteButton = <button
        className="float-right btn btn-danger btn-sm"
        onClick={this.deleteReason}>
        <i className="fa fa-exclamation-triangle"></i>
        Delete</button>
    }

    let emergency = <FlipOption
      handleClick={this.flipEmergency}
      active={this.state.show_emergency == '1'}
      title="Reason ask visitor if they have an emergency"
      label="Ask emergency"
      icon="fa-exclamation-triangle"/>

    let phone = <FlipOption
      handleClick={this.flipAskForPhone}
      active={this.state.ask_for_phone == '1'}
      title="Choosing this asks for the visitor's phone number"
      label="Phone number"
      icon="fa-phone"/>

    let cardHeaderClass = 'card-header bg-' + this.state.color
    let cardClass = 'card mb-3 border-' + this.state.color    
    let props = {
      reasonId: this.state.id,
      reload: this.props.reload,
      currentEdit: this.props.currentEdit,
      setCurrentEdit: this.props.setCurrentEdit
    }

    return (
      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <span className="badge">{this.state.ordering}</span>
          {deleteButton}
          <div className="clearfix"></div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6">
              <div className="section">
                <strong>Title:</strong>
                <ReasonTitle
                  value={this.state.title}
                  reset={this.resetTitle}
                  update={this.updateTitle}
                  save={this.saveTitle}
                  {...props}/>
              </div>
              <div className="section">
                <strong>Description:</strong>
                <ReasonDescription
                  value={this.state.description}
                  reset={this.resetDescription}
                  update={this.updateDescription}
                  save={this.saveDescription}
                  {...props}/>
              </div>
              <div className="section">
                <strong>Reason highlight</strong>
                <PickColor handleClick={this.pickColor}/>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="section">
                <strong>Instruction:</strong>
                <ReasonInstruction
                  value={this.state.instruction}
                  reset={this.resetInstruction}
                  update={this.updateInstruction}
                  save={this.saveInstruction}
                  {...props}/>
              </div>
              <div className="section">
                <strong>Category:</strong><br/>
                <ReasonCategory
                  value={this.state.category}
                  reset={this.resetCategory}
                  update={this.updateCategory}
                  save={this.saveCategory}
                  {...props}/>
              </div>
              <div className="section">
                {phone}
              </div>
              <div className="section">
                {emergency}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReasonRow.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  instruction: PropTypes.string,
  show_emergency: PropTypes.string,
  category: PropTypes.string,
  ask_for_phone: PropTypes.string,
  active: PropTypes.string,
  sorting: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]),
  color: PropTypes.string,
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func
}

const ReasonTitle = (props) => {
  return (<ReasonValue
    {...props}
    placeholder="One or two words describing reason. Internal use only."
    section="1"/>)
}

class ReasonCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
  }

  componentDidMount() {
    this.setState({editMode: this.props.editMode})
  }

  componentDidUpdate() {
    $('.editItem').focus()
  }

  formMode() {
    this.props.setCurrentEdit(this.props.reasonId, 4)
    this.setState({editMode: true})
  }

  closeForm() {
    this.setState({editMode: false})
    this.props.reset()
  }

  save() {
    this.setState({editMode: false})
    this.props.save()
  }

  render() {
    var value = null
    var matchOption = null

    switch (this.props.value) {
      case '0':
        matchOption = 'Other'
        break

      case '1':
        matchOption = 'Walk-in'
        break

      case '2':
        matchOption = 'Individual appointment'
        break

      case '3':
        matchOption = 'Group appointment'
        break
    }

    const selectOptions = [
      {
        value: '0',
        label: 'Other'
      }, {
        value: '1',
        label: 'Walk-in'
      }, {
        value: '2',
        label: 'Individual appointment'
      }, {
        value: '3',
        label: 'Group appointment',
      },
    ]

    const pointer = {
      cursor: 'pointer'
    }

    if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == '4') {
      value = (
        <div className="row">
          <div className="col-sm-8">
            <ReasonSelect
              options={selectOptions}
              match={this.props.value}
              handleChange={this.props.update}/>
          </div>
          <div className="col-sm-4">
            <button className="btn btn-success" onClick={this.save}>
              <i className="fa fa-check"></i>
            </button>
            <button className="btn btn-danger" onClick={this.closeForm}>
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
      )
    } else {
      value = <div
        style={pointer}
        onClick={this.formMode}
        className="col-sm-8 editItem"
        title="Click to edit">{matchOption}</div>
    }

    return (
      <div>{value}</div>
    )
  }
}

ReasonCategory.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]),
  editMode: PropTypes.bool,
  reasonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]),
  reset: PropTypes.func,
  update: PropTypes.func,
  save: PropTypes.func,
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func
}

class ReasonInstruction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
    this.formMode = this.formMode.bind(this)
  }

  componentDidUpdate() {
    $('.editItem').focus()
  }

  componentDidMount() {
    this.setState({editMode: this.props.editMode})
  }

  formMode() {
    this.props.setCurrentEdit(this.props.reasonId, 3)
    this.setState({editMode: true})
  }

  closeForm() {
    this.setState({editMode: false})
    this.props.reset()
  }

  save() {
    this.setState({editMode: false})
    this.props.save()
  }

  render() {
    var value = null
    var matchOption = null
    if (this.props.value === '1') {
      matchOption = 'Sit down'
    } else {
      matchOption = 'See the front desk'
    }

    var selectOptions = [
      {
        value: '1',
        label: 'Sit down'
      }, {
        value: '2',
        label: 'See front desk'
      },
    ]

    const pointer = {
      cursor: 'pointer'
    }

    if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == '3') {
      value = (
        <div className="row">
          <div className="col-sm-8">
            <ReasonSelect
              options={selectOptions}
              match={this.props.value}
              handleChange={this.props.update}/>
          </div>
          <div className="col-sm-4">
            <button className="btn btn-success" onClick={this.save}>
              <i className="fa fa-check"></i>
            </button>
            <button className="btn btn-danger" onClick={this.closeForm}>
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
      )
    } else {
      value = <div
        style={pointer}
        onClick={this.formMode}
        className="col-sm-8 editItem"
        title="Click to edit">{matchOption}</div>
    }

    return (
      <div>{value}</div>
    )
  }
}

ReasonInstruction.propTypes = {
  value: PropTypes.string,
  editMode: PropTypes.bool,
  reasonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]),
  reset: PropTypes.func,
  update: PropTypes.func,
  save: PropTypes.func,
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func
}

const ReasonSelect = (options, match, handleChange) => {
  let optionList = []
  optionList.displayName = 'asd'
  options.displayName = 'asd'
  optionList = options.map(function (value, key) {
    return (
      <option key={key} value={value.value}>{value.label}</option>
    )
  }.bind(this))

  return (
    <select defaultValue={match} className="form-control" onChange={handleChange}>
      {optionList}
    </select>
  )
}

ReasonSelect.displayName = ''

ReasonSelect.propTypes = {
  match: PropTypes.string,
  handleChange: PropTypes.func,
  options: PropTypes.array
}
    
const ReasonDescription = (props) => {
  return (<ReasonValue
    {...props}
    placeholder="Description of reason. Seen by visitors."
    section="2"/>)
}

class ReasonValue extends Component {
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
    this.props.setCurrentEdit(this.props.reasonId, this.props.section)
    this.setState({editMode: true})
  }

  save() {
    this.setState({editMode: false})
    this.props.save()
  }

  render() {
    var value = null
    if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == this.props.section) {
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

ReasonValue.propTypes = {
  value: PropTypes.string,
  reasonId: PropTypes.oneOfType([PropTypes.number, PropTypes.string,]),
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

const FlipOption = ({handleClick, active, label, icon}) => {

  let divClass
  let iconClass = 'fa fa-lg ' + icon
  let title

  if (active) {
    divClass = 'text-success'
    title = 'Click to disable'
  } else {
    divClass = 'dim'
    title = 'Click to enable'
  }

  const pointer = {
    cursor: 'pointer'
  }
  return (
    <div onClick={handleClick} className={divClass} style={pointer} title={title}>
      <i className={iconClass} title={title}></i>&nbsp; {label}
    </div>
  )
}

FlipOption.propTypes = {
  handleClick: PropTypes.func,
  active: PropTypes.bool,
  title: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
}
