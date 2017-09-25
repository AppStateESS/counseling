'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $ */

class SummaryCompleted extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tooltip: true
    }
  }

  componentDidMount() {
    $(window).load(function () {
      this.loadTooltip()
    }.bind(this))
  }

  loadTooltip() {
    $('.total-complete div.big-number').popover({
      animation: true,
      placement: 'bottom',
      trigger: 'hover',
      container: '.summary .right',
      title: 'Not seen reasons',
      html: true
    })
    $('.total-complete div.big-number').css('cursor', 'pointer')
    this.setState({tooltip: false})
  }

  render() {
    var reasons = null
    if (this.props.leaveReasons !== null) {
      reasons = this.props.leaveReasons.join('<br />')
    }
    return (
      <div className="total-complete text-center">
        <div className="big-number" data-content={reasons}>
          {this.props.totalComplete}
        </div>
        <div>Total<br/>Visits</div>
      </div>
    )
  }
}

SummaryCompleted.propTypes = {
  totalComplete: PropTypes.string,
  leaveReasons: PropTypes.array,
}

SummaryCompleted.defaultProps = {
  leaveReasons: []
}

export default SummaryCompleted
