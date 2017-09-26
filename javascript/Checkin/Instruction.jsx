'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Instruction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      instructions: null
    }
  }
  render() {
    var instruction = null

    if (this.props.instruction === '1') {
      instruction = this.props.instructionList['1']
    } else {
      instruction = this.props.instructionList['2']
    }

    return (
      <div className="checkin-box">
        <div className="text-center">
          <p className="title">Ok, you're checked in.</p>
          <p className="subtitle">{instruction}</p>
        </div>
        <div className="text-right">
          <button className="btn btn-default" onClick={this.props.reset}>Finished</button>
        </div>
      </div>
    )
  }
}

Instruction.defaultProps = {
  instruction: '1',
  instructionList: null,
  reset: null
}

Instruction.propTypes = {
  instruction: PropTypes.string,
  instructionList: PropTypes.object,
  reset: PropTypes.func,
}
