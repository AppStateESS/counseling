'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TextInput, PickColor,} from '../Mixins'

/* global $ */

export default class DispositionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      color: 'default',
      icon: null,
      formError: ''
    }
    this.updateTitle = this.updateTitle.bind(this)
    this.pickColor = this.pickColor.bind(this)
    this.pickIcon = this.pickIcon.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.save = this.save.bind(this)
  }

  pickColor(color, event) {
    event.preventDefault()
    this.setState({color: color})
  }

  componentWillMount() {
    this.setState({title: this.props.title, color: this.props.color, icon: this.props.icon, dispositionId: this.props.dispositionId})
  }

  componentDidMount() {
    $('#title').focus()
  }

  closeForm(event) {
    event.preventDefault()
    this.props.closeForm()
  }

  updateTitle(event) {
    this.setState({title: event.target.value})
  }

  save(event) {
    event.preventDefault()

    if (this.state.title === null || this.state.title.length === 0) {
      $('#title').css('borderColor', 'red')
      this.setState({formError: 'Title empty'})
      return
    }

    this.setState({formError: false})
    $.post('counseling/Admin/Settings/Disposition', {
      command: 'save',
      dispositionId: this.state.dispositionId,
      title: this.state.title,
      icon: this.state.icon,
      color: this.state.color
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this)).fail(function () {
      this.props.fail()
    }.bind(this)).always(function () {
      this.props.closeForm()
    }.bind(this))

  }

  pickIcon(icon, event) {
    event.preventDefault()
    this.setState({icon: icon})
  }

  render() {
    let alert = null
    if (this.state.formError.length > 0) {
      alert = <div className="alert alert-danger" style={{
        fontSize: '1em'
      }}>
        {this.state.formError}</div>
    }
    return (
      <div className="disposition-form">
        {alert}
        <CurrentIcon
          icon={this.state.icon}
          color={this.state.color}
          title={this.state.title}/>
        <form method="post" action="counseling/Admin/Settings/Disposition">
          <input type="hidden" name="command" value="add"/>
          <TextInput
            inputId="title"
            label="Disposition title"
            handleChange={this.updateTitle}
            required={true}
            tabIndex={1}
            value={this.state.title}/>
          <label>Button color</label>
          <PickColor handleClick={this.pickColor}/>
          <label>Icon</label>
          <DispositionIcons handleClick={this.pickIcon}/>
          <hr/>
          <button className="pull-left btn btn-primary" onClick={this.save} tabIndex={2}>
            <i className="fa fa-check"></i>
            Save Disposition</button>&nbsp;
          <button className="btn btn-danger" onClick={this.closeForm} tabIndex={3}>
            <i className="fa fa-exclamation-triangle"></i>
            Cancel</button>
        </form>
      </div>
    )
  }
}

DispositionForm.propTypes = {
  closeForm: PropTypes.func,
  reload: PropTypes.func,
  fail: PropTypes.func,
  title: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  dispositionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number,])
}

DispositionForm.defaultProps = {
  title: ''
}

const CurrentIcon = ({color, icon, title}) => {

  const buttonClass = 'btn btn-block btn-lg btn-' + color
  const iconClass = 'fa fa-' + icon
  const iconTitle = (title === null || title.length === 0)
    ? 'Sample'
    : title

  return (
    <div className="text-center">
      <button className={buttonClass}>
        <i className={iconClass}></i>
        {iconTitle}</button>
    </div>
  )
}

CurrentIcon.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
}

const DispositionIcons = ({handleClick}) => {
  return (
    <div>
      <table className="table">
        <tbody>
          <tr>
            <td><IconButton label="archive" handleClick={handleClick}/></td>
            <td><IconButton label="automobile" handleClick={handleClick}/></td>
            <td><IconButton label="balance-scale" handleClick={handleClick}/></td>
            <td><IconButton label="ban" handleClick={handleClick}/></td>
            <td><IconButton label="bank" handleClick={handleClick}/></td>
            <td><IconButton label="bed" handleClick={handleClick}/></td>
            <td><IconButton label="bell" handleClick={handleClick}/></td>
            <td><IconButton label="binoculars" handleClick={handleClick}/></td>
            <td><IconButton label="book" handleClick={handleClick}/></td>
            <td><IconButton label="briefcase" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="building" handleClick={handleClick}/></td>
            <td><IconButton label="bullhorn" handleClick={handleClick}/></td>
            <td><IconButton label="camera" handleClick={handleClick}/></td>
            <td><IconButton label="coffee" handleClick={handleClick}/></td>
            <td><IconButton label="cog" handleClick={handleClick}/></td>
            <td><IconButton label="comment" handleClick={handleClick}/></td>
            <td><IconButton label="envelope" handleClick={handleClick}/></td>
            <td><IconButton label="exclamation-circle" handleClick={handleClick}/></td>
            <td><IconButton label="eye" handleClick={handleClick}/></td>
            <td><IconButton label="flag" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="flask" handleClick={handleClick}/></td>
            <td><IconButton label="folder-o" handleClick={handleClick}/></td>
            <td><IconButton label="gavel" handleClick={handleClick}/></td>
            <td><IconButton label="globe" handleClick={handleClick}/></td>
            <td><IconButton label="users" handleClick={handleClick}/></td>
            <td><IconButton label="heart" handleClick={handleClick}/></td>
            <td><IconButton label="home" handleClick={handleClick}/></td>
            <td><IconButton label="hourglass-1" handleClick={handleClick}/></td>
            <td><IconButton label="calendar" handleClick={handleClick}/></td>
            <td><IconButton label="life-ring" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="lightbulb-o" handleClick={handleClick}/></td>
            <td><IconButton label="male" handleClick={handleClick}/></td>
            <td><IconButton label="female" handleClick={handleClick}/></td>
            <td><IconButton label="map-o" handleClick={handleClick}/></td>
            <td><IconButton label="microphone" handleClick={handleClick}/></td>
            <td><IconButton label="money" handleClick={handleClick}/></td>
            <td><IconButton label="music" handleClick={handleClick}/></td>
            <td><IconButton label="paint-brush" handleClick={handleClick}/></td>
            <td><IconButton label="pencil" handleClick={handleClick}/></td>
            <td><IconButton label="phone" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="plug" handleClick={handleClick}/></td>
            <td><IconButton label="print" handleClick={handleClick}/></td>
            <td><IconButton label="puzzle-piece" handleClick={handleClick}/></td>
            <td><IconButton label="trophy" handleClick={handleClick}/></td>
            <td><IconButton label="umbrella" handleClick={handleClick}/></td>
            <td><IconButton label="user-plus" handleClick={handleClick}/></td>
            <td><IconButton label="warning" handleClick={handleClick}/></td>
            <td><IconButton label="wrench" handleClick={handleClick}/></td>
            <td><IconButton label="comments-o" handleClick={handleClick}/></td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

DispositionIcons.propTypes = {
  handleClick: PropTypes.func
}

const IconButton = ({label, handleClick,}) => {
  const iconClassName = 'fa fa-' + label
  return (
    <button className="btn btn-default" onClick={handleClick.bind(null, label)}>
      <i className={iconClassName}></i>
    </button>
  )
}

IconButton.propTypes = {
  label: PropTypes.string,
  handleClick: PropTypes.func,
}
