'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ButtonGroup from '../Share/ButtonGroup'

/* global $ */

const WaitingAction = (props) => {

  const completeReason = (reason) => {
    $.post('counseling/Admin/Dashboard/Waiting', {
      command: 'setCompleteReason',
      reason: reason,
      visitId: props.visitId,
    }, null, 'json').done(function () {
      props.reload()
    }.bind(this))
  }

  const remove = () => {
    if (confirm('Are you sure you want to remove this visitor?')) {
      $.post('counseling/Admin/Dashboard/Waiting', {
        command: 'delete',
        visitId: props.visitId,
      }, null, 'json').done(function () {
        props.reload()
      }.bind(this))
    }
  }

  const getOptions = () => {
    var options = []
    options.push({
      label: <div>
        <i className="fas fa-external-link-square-alt"></i>&nbsp; Had to leave</div>,
      visitId: props.visitId,
      handleClick: completeReason.bind(null, 2),
    }, {
      label: <div>
        <i className="fa fa-user-plus"></i>&nbsp; Full, agreed to return</div>,
      visitId: props.visitId,
      handleClick: completeReason.bind(null, 6),
    }, {
      label: <div>
        <i className="fa fa-eye-slash"></i>&nbsp; Missing</div>,
      visitId: props.visitId,
      handleClick: completeReason.bind(null, 3),
    }, {
      label: <div>
        <i className="fas fa-clock"></i>&nbsp; Made appointment</div>,
      visitId: props.visitId,
      handleClick: completeReason.bind(null, 4),
    }, {
      divider: true
    }, {
      label: <div className="text-danger">
        <i className="far fa-trash-alt"></i>&nbsp; Remove</div>,
      visitId: props.visitId,
      handleClick: remove,
    })
    return options
  }

  var options = getOptions()
  return <ButtonGroup options={options}/>
}

WaitingAction.propTypes = {
  visitId: PropTypes.string
}

export default WaitingAction
