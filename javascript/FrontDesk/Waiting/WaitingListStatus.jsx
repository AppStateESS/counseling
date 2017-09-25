'use strict'
import React from 'react'
import PropTypes from 'prop-types'

/* global $ */

const WaitingListStatus = (props) => {

  const intakeComplete = () => {
    if (confirm('Click OK if student completed their intake form.')) {
      $.post('counseling/Admin/Dashboard/Waiting/', {
        command: 'intakeComplete',
        visitorId: props.visitor.id,
      }, null, 'json').done(function () {
        props.reload()
      })
    }
  }

  if (props.visitor.intake_complete === '1') {
    if (props.visitNumber > 1) {
      if (props.visitor.seen_last_visit === '0') {
        return <span className="label label-danger">Unseen last visit</span>
      } else {
        return (
          <span className="label label-primary">
            Previously seen @ {props.visitor.previously_seen}
          </span>
        )
      }
    } else {
      return <span className="label label-success">Intake complete</span>
    }
  } else {
    return <span
      className="label label-danger pointer"
      title="Click to acknowledge intake completion"
      onClick={intakeComplete}>Intake incomplete</span>
  }
}

WaitingListStatus.propTypes = {
  visitor: PropTypes.object,
  visitNumber: PropTypes.string,
}

export default WaitingListStatus
