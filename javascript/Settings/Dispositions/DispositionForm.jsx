'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TextInput, PickColor,} from '../Mixins'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

/* global $ */

export default class DispositionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      color: null,
      iconPrefix: '',
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

  pickIcon(iconPrefix, icon, event) {
    event.preventDefault()
    this.setState({iconPrefix: iconPrefix, icon: icon})
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
          iconPrefix={this.state.iconPrefix ? this.state.iconPrefix : 'fas'}
          icon={this.state.icon}
          color={this.state.color}
          title={this.state.title}/>
    
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

const CurrentIcon = ({color, iconPrefix, icon, title}) => {

  const buttonClass = 'btn btn-block btn-lg btn-' + color
  const iconClass = icon
  const iconTitle = (title === null || title.length === 0)
    ? 'Sample'
    : title
  const spacer = (color == null) ? '' : <br />
  return (
    <div className="text-center">
        <button className={buttonClass}><FontAwesomeIcon icon={[iconPrefix, iconClass]}/>
{iconTitle}</button>
        {spacer}
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
          
            <td><IconButton iconPrefix='fas' label='archive' handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="car" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="balance-scale" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="ban" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="university" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="bed" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="bell" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="binoculars" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="book" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="briefcase" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton iconPrefix='fas' label="building" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="bullhorn" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="camera" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="coffee" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="cog" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="comment" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="envelope" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="exclamation-circle" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="eye" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="flag" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton iconPrefix='fas' label="flask" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="folder" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="gavel" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="globe" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="users" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="heart" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="home" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="hourglass" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="calendar" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="life-ring" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton iconPrefix='fas' label="lightbulb" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="male" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="female" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="map" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="microphone" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="money-bill-alt" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="music" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="paint-brush" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="pencil-alt" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="phone" handleClick={handleClick}/></td>
          </tr>
          <tr>
            <td><IconButton iconPrefix='fas' label="plug" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="print" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="puzzle-piece" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="trophy" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="umbrella" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="user-plus" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="exclamation-triangle" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="wrench" handleClick={handleClick}/></td>
            <td><IconButton iconPrefix='fas' label="comments" handleClick={handleClick}/></td>
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

const IconButton = ({iconPrefix, label, handleClick}) => {
  const iconClassName = label
  return (
    <button className="btn btn-default" onClick={handleClick.bind(null, iconPrefix, label)}>
      <FontAwesomeIcon icon={[iconPrefix, iconClassName]}/>
    </button>
  )
}

IconButton.propTypes = {
  label: PropTypes.string,
  handleClick: PropTypes.func,
}
