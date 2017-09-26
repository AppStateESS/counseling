'use strict'
import React from 'react'
import ErrorTimeout from './ErrorTimeout'
import PropTypes from 'prop-types'

export default class Phone extends ErrorTimeout {
  constructor(props) {
    super(props)
    this.state = {
      phoneNumber: '',
      error: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.updatePhone = this.updatePhone.bind(this)
  }

  componentDidMount() {
    this.setState({phoneNumber: this.props.visitor.phone_number})
  }

  updatePhone() {
    if (this.state.phoneNumber.length < 10) {
      this.setState({error: true})
    } else {
      this.props.update(this.state.phoneNumber)
    }
  }

  handleChange(e) {
    this.setState({phoneNumber: e.target.value})
  }

  render() {
    var field = null
    if (this.state.error) {
      field = (
        <div
          className="alert alert-danger alert-dismissible"
          role="alert"
          ref="errorAlert">
          <button className="close" type="button" onClick={this.resetForm}>
            <i className="fa fa-times"></i>
          </button>
          Please enter your cell phone number including your area code.
        </div>
      )
    } else {
      field = <input
        type="text"
        ref="phone"
        className="form-control"
        placeholder="Cell phone number with area code"
        value={this.state.phoneNumber}
        onChange={this.handleChange}/>
    }

    return (
      <div className="checkin-box">
        <div className="text-center">
          <p className="title">Ok, {this.props.visitor.preferred_name}.</p>
          <p className="subtitle">In case we need to reach you later,<br/>
            please enter your cell phone number.</p>
          {field}
          <button
            className="continue pull-left btn btn-default"
            onClick={this.props.back}>
            <i className="fa fa-chevron-left fa-sm"></i>&nbsp;
            Back
          </button>
          <button
            className="continue pull-right btn btn-default"
            onClick={this.updatePhone}>Continue&nbsp;
            <i className="fa fa-chevron-right fa-sm"></i>
          </button>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }
}

Phone.propTypes = {
  update: PropTypes.func,
}
