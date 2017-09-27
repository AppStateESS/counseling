'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Swipe from './Swipe'
import Reason from './Reason'
import Phone from './Phone'
import Emergency from './Emergency'
import Instruction from './Instruction'

/* global $, currentLocation */

let resetTimeout = null

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 'swipe'
    }
    this.updateStage = this.updateStage.bind(this)
  }

  updateStage(stage) {
    this.setState({stage: stage})
  }

  render() {
    return (<Stage updateStage={this.updateStage} stage={this.state.stage}/>)
  }

}

class Stage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visitor: null,
      reason: null,
      phone: null,
      emergency: false,
      instructionList: null,
    }
    this.updateVisitor = this.updateVisitor.bind(this)
    this.updateReason = this.updateReason.bind(this)
    this.backToReason = this.backToReason.bind(this)
    this.updatePhone = this.updatePhone.bind(this)
    this.updateEmergency = this.updateEmergency.bind(this)
    this.resetLogin = this.resetLogin.bind(this)
  }

  componentDidMount() {
    $.getJSON('counseling/User/Checkin', {command: 'instructions'}).done(function (data) {
      this.setState({instructionList: data})
    }.bind(this))

  }

  updateReason(reason) {
    this.setState({reason: reason})
    if (reason.ask_for_phone === '1') {
      this.props.updateStage('phone')
    } else {
      if (reason.show_emergency === '1') {
        this.props.updateStage('emergency')
      } else {
        this.props.updateStage('instruction')
      }
    }
  }

  updateVisitor(visitor) {
    this.setState({visitor: visitor})
    this.props.updateStage('reason')
  }

  updatePhone(phone) {
    if (phone === null || phone.length === 0) {
      return
    }
    //update phone number if changed
    if (phone !== this.state.visitor.phone_number) {
      $.post('counseling/User/Visitor', {
        command: 'updatePhone',
        visitorId: this.state.visitor.id,
        phoneNumber: phone,
      }, null, 'json')
    }

    this.setState({phone: phone})
    if (this.state.reason.show_emergency === '1') {
      this.props.updateStage('emergency')
    } else {
      this.props.updateStage('instruction')
    }
  }

  updateEmergency(emergency) {
    this.setState({emergency: emergency})
    this.props.updateStage('instruction')
  }

  componentDidUpdate() {
    if (this.props.stage === 'instruction') {
      this.completeCheckin()
    }
  }

  completeCheckin() {
    $.post('counseling/User/Visit', {
      command: 'create',
      locationId: currentLocation,
      visitorId: this.state.visitor.id,
      reasonId: this.state.reason.id,
      emergency: this.state.emergency,
    }, null, 'json').done(function () {
      resetTimeout = setTimeout(this.resetLogin, 5000)
    }.bind(this))
  }

  resetLogin() {
    clearTimeout(resetTimeout)
    this.props.updateStage('swipe')
    this.setState({visitor: null, reason: null, phone: null, emergency: false})
  }

  backToReason() {
    this.setState({reason: null})
    this.props.updateStage('reason')
  }

  render() {
    switch (this.props.stage) {
      case 'swipe':
        return <Swipe update={this.updateVisitor}/>

      case 'reason':
        return <Reason update={this.updateReason} visitor={this.state.visitor}/>

      case 'phone':
        return <Phone
          update={this.updatePhone}
          visitor={this.state.visitor}
          back={this.backToReason}/>

      case 'emergency':
        return <Emergency update={this.updateEmergency}/>

      case 'instruction':
        return <Instruction
          reset={this.resetLogin}
          instruction={this.state.reason.instruction}
          instructionList={this.state.instructionList}/>
    }
  }

}

Stage.propTypes = {
  stage: PropTypes.string,
  updateStage: PropTypes.func,
}
