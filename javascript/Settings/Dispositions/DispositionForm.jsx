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
      formError: '',
      dispositionId: 0,
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

    let sample = <CurrentIcon
          icon={this.state.icon}
          color={this.state.color}
          title={this.state.title}/>
    sample = '';// till we can figure out how to force font awesome to redraw icons

    return (
      <div className="disposition-form">
        {alert}
        {sample}
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
  const iconClass = icon
  const iconTitle = (title === null || title.length === 0)
    ? 'Sample'
    : title
  
  return (
    <div className="text-center">
        <button className={buttonClass}><i className={iconClass}></i>
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
            <td><IconButton label="fa fa-archive" handleClick={handleClick}/></td>
            <td><IconButton label="fas fa-car" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-balance-scale" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-ban" handleClick={handleClick}/></td>
            <td><IconButton label="fas fa-university" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-bed" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-bell" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-binoculars" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-book" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-briefcase" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="fa fa-building" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-bullhorn" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-camera" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-coffee" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-cog" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-comment" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-envelope" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-exclamation-circle" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-eye" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-flag" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="fa fa-flask" handleClick={handleClick}/></td>
            <td><IconButton label="far fa-folder" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-gavel" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-globe" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-users" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-heart" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-home" handleClick={handleClick}/></td>
            <td><IconButton label="fas fa-hourglass" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-calendar" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-life-ring" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="fas fa-lightbulb" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-male" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-female" handleClick={handleClick}/></td>
            <td><IconButton label="fas fa-map" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-microphone" handleClick={handleClick}/></td>
            <td><IconButton label="far fa-money-bill-alt" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-music" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-paint-brush" handleClick={handleClick}/></td>
            <td><IconButton label="fas fa-pencil-alt" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-phone" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton label="fa fa-plug" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-print" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-puzzle-piece" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-trophy" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-umbrella" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-user-plus" handleClick={handleClick}/></td>
            <td><IconButton label="fas fa-exclamation-triangle" handleClick={handleClick}/></td>
            <td><IconButton label="fa fa-wrench" handleClick={handleClick}/></td>
            <td><IconButton label="fas fa-comments" handleClick={handleClick}/></td>
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

const IconButton = ({prefix, label, handleClick,}) => {
  const iconClassName = label
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
