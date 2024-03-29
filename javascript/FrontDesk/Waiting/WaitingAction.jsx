'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ButtonGroup from '../Share/ButtonGroup'

/* global $ */

const WaitingAction = (props) => {
  const completeReason = (reason) => {
    $.post(
      'counseling/Admin/Dashboard/Waiting',
      {
        command: 'setCompleteReason',
        reason: reason,
        visitId: props.visitId,
      },
      null,
      'json'
    ).done(
      function () {
        props.reload()
      }.bind(this)
    )
  }

  const remove = () => {
    if (confirm('Are you sure you want to remove this visitor?')) {
      $.post(
        'counseling/Admin/Dashboard/Waiting',
        {
          command: 'delete',
          visitId: props.visitId,
        },
        null,
        'json'
      ).done(
        function () {
          props.reload()
        }.bind(this)
      )
    }
  }

  const getOptions = () => {
    var options = []
    options.push(
      {
        label: (
          <div className="pointer">
            <i className="fas fa-external-link-square-alt"></i>&nbsp;Had to
            leave
          </div>
        ),
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 2),
      },
      {
        label: (
          <div className="pointer">
            <i className="fa fa-fw fa-user-plus"></i>&nbsp;Full, agreed to
            return
          </div>
        ),
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 6),
      },
      {
        label: (
          <div className="pointer">
            <i className="fa fa-fw fa-eye-slash"></i>&nbsp;Missing
          </div>
        ),
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 3),
      },
      {
        label: (
          <div className="pointer">
            <i className="fas fa-fw fa-clipboard-list"></i>&nbsp;Rescheduled
          </div>
        ),
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 9),
      },
      {
        label: (
          <div className="pointer">
            <i className="fas fa-fw fa-clock"></i>&nbsp;Made appointment
          </div>
        ),
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 4),
      },
      {
        label: (
          <div className="pointer">
            <i className="fas fa-fw fa-comment-slash"></i>&nbsp;Canceled
          </div>
        ),
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 7),
      },
      {
        label: (
          <div className="pointer">
            <i className="fas fa-fw fa-times-circle"></i>&nbsp;No show
          </div>
        ),
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 8),
      },
      {
        divider: true,
      },
      {
        label: (
          <div className="text-danger pointer">
            <i className="far fa-fw fa-trash-alt"></i>&nbsp;Remove
          </div>
        ),
        visitId: props.visitId,
        handleClick: remove,
      }
    )
    return options
  }

  var options = getOptions()
  const label = <i className="fas fa-cog"></i>
  return <ButtonGroup label={label} options={options} />
}

WaitingAction.propTypes = {
  visitId: PropTypes.string,
  reload: PropTypes.func,
}

export default WaitingAction
