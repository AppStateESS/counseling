'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $ */

export default class Reason extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reasons: null
    }
  }

  componentDidMount() {
    $.getJSON('counseling/User/Reason', {command: 'list'}).done(function (data) {
      if (data === null) {
        data = []
      }
      this.setState({reasons: data})
    }.bind(this))

  }

  pickReason(key) {
    this.props.update(this.state.reasons[key])
  }

  render() {
    var content

    if (this.state.reasons === null) {
      content = 'Loading...'
    } else if (this.state.reasons.length === 0) {
      content = <div className="alert alert-danger">System error: Please alert front desk.</div>
    } else {
      var reasonList = this.state.reasons.map(function (value, i) {
        return <li
          key={i}
          className="list-group-item pointer"
          onClick={this.pickReason.bind(this, i)}>{value.description}</li>
      }.bind(this))
      content = (
        <div>
          <div className="text-center">
            <p className="title">Hello, {this.props.visitor.preferred_name}.</p>
            <p className="title">Why are you visiting today?</p>
          </div>
          <ul className="list-group">
            {reasonList}
          </ul>
        </div>
      )
    }
    return <div className="checkin-box">{content}</div>
  }
}

Reason.propTypes = {
  update: PropTypes.func,
  visitor: PropTypes.object
}
