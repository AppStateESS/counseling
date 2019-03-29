'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ErrorTimeout from './ErrorTimeout'
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

/* global $ */

var swipeTimeout = null

class Swipe extends ErrorTimeout {
  constructor(props) {
    super(props)
    this.state = {
      error: 0,
      visitor: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.logInVisitor = this.logInVisitor.bind(this)
    this.submitVisitor = this.submitVisitor.bind(this)
    this.resetSwipe = this.resetSwipe.bind(this)
  }

  loginFailure() {
    this.setState({visitor: '', error: 1,})
    this.timedReset()
  }

  alreadyVisiting() {
    this.setState({visitor: '', error: 2,})
  }

  timedReset() {
    swipeTimeout = setTimeout(function () {
      this.resetSwipe()
    }.bind(this), 4000)
  }

  resetSwipe() {
    clearTimeout(swipeTimeout)
    this.setState({error: 0, visitor: ''})
  }

  logInVisitor() {
    var visitor = this.state.visitor
    if (visitor && visitor.length > 3) {
      if (visitor.charAt(0) === ';' && visitor.charAt(10) === '=') {
        visitor = visitor.slice(1, 10)
      }

      $.getJSON('counseling/User/Checkin', {
        command: 'loginVisitor',
        bannerId: visitor,
      }).done(function (data) {
        if (data.waiting !== undefined) {
          this.alreadyVisiting()
          this.timedReset()
        } else if (data.visitor === null) {
          this.loginFailure()
        } else {
          this.props.update(data)
        }
      }.bind(this)).fail(function () {
        this.loginFailure()
      }.bind(this))
    } else {
      this.loginFailure()
    }
  }

  handleChange(e) {
    var character = e.target.value
    this.setState({visitor: character})
  }

  submitVisitor(e)
  {
    e.preventDefault()
    this.logInVisitor()
  }

  focusSwiper() {
    $('#swiper').focus()
  }

  componentDidUpdate() {
    this.focusSwiper()
  }

  componentDidMount() {
    this.focusSwiper()
  }

  render() {
    var field = null
    var button = null

    if (this.state.error === 1) {
      field = (
        <div className="text-center">
          <div
            className="alert alert-danger alert-dismissible"
            role="alert"
            ref="errorAlert">
            Account not found. Please try again or see the front desk.
          </div>
          <button className="btn btn-default" type="button" onClick={this.resetSwipe}>
            <i className="fas fa-redo-alt"></i>&nbsp;
            Try again</button>
        </div>
      )
    } else if (this.state.error === 2) {
      field = (
        <div
          className="alert alert-warning alert-dismissible"
          role="alert"
          ref="errorAlert">
          <button className="close" type="button" onClick={this.resetSwipe}>
            <i className="fas fa-times"></i>
          </button>
          You are already logged in. Please visit the front desk if you have a question or
          concern.
        </div>
      )
    } else {
      field = <input
        id="swiper"
        type="text"
        placeholder="Banner ID"
        onChange={this.handleChange}
        className="form-control"
        value={this.state.visitor}/>
      button = <button
        className="continue btn btn-default"
        onClick={this.logInVisitor}>Continue&nbsp;
        <i className="fa fa-chevron-right fa-sm"></i>
      </button>
    }

    return (
      <div className="checkin-box">
        <div className="text-center center-block">
          <p className="title">Welcome! Please Check-in</p>
          <p className="subtitle">Swipe your AppCard to get started</p>
          <p>Don't have your AppCard?<br/>Enter your Banner ID number instead.</p>
          <form onSubmit={this.submitVisitor}>
            {field}
          </form>
          {button}
        </div>        
        <div className="clearfix"></div>
      </div>
    )
  }
}

Swipe.propTypes = {
  update: PropTypes.func,
}

export default Swipe
