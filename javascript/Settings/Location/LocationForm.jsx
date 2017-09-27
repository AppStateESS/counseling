'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TextInput} from '../Mixins'

/* global $ */

export default class LocationForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      locationId: 0,
      color: 'default',
      formError: ''
    }
    this.save = this.save.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.closeForm = this.closeForm.bind(this)
  }

  componentWillMount() {
    this.setState({title: this.props.title, locationId: this.props.locationId,})
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
    if (this.state.title === null || this.state.title === undefined || this.state.title.length === 0) {
      $('#title').css('borderColor', 'red')
      this.setState({formError: 'Title empty'})
      return
    }

    $.post('counseling/Admin/Settings/Location', {
      command: 'save',
      locationId: this.state.locationId,
      title: this.state.title,
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this)).fail(function () {
      this.props.fail()
    }.bind(this)).always(function () {
      this.props.closeForm()
    }.bind(this))
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
      <div className="locationForm">
        {alert}
        <form method="post" action="counseling/Admin/Settings/Location">
          <TextInput
            inputId="title"
            label="Location title"
            handleChange={this.updateTitle}
            required={true}
            tabIndex={1}
            value={this.state.title}/>
            <button className="pull-left btn btn-primary" onClick={this.save} tabIndex={2}>
              <i className="fa fa-check"></i>
              Save Location</button>&nbsp;
            <button className="btn btn-danger" onClick={this.closeForm} tabIndex={3}>
              <i className="fa fa-exclamation-triangle"></i>
              Cancel</button>
        </form>
      </div>
    )
  }
}

LocationForm.propTypes = {
  closeForm: PropTypes.func,
  reload: PropTypes.func,
  fail: PropTypes.func,
  title: PropTypes.string,
  locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]),
}
