import React from 'react'
import PropTypes from 'prop-types'
import CategoryIcon from './Share/CategoryIcon'
import VisitorName from './Share/VisitorName'
import ClipboardInput from './Share/ClipboardInput'
import WaitingListVisits from './Waiting/WaitingListVisits'
import WaitingListStatus from './Waiting/WaitingListStatus'
import ButtonGroup from './Share/ButtonGroup'

/* global $ */

const Appointment = (props) => {
  if (!props.appointments) {
    return <div>No appointments waiting</div>
  }
  let count = 0

  let listRows = props.appointments.map(function (value, key) {
    count = count + 1
    return <AppointmentRow key={key} {...value} count={count} reload={props.reload}/>
  }.bind(this))

  return (
    <div className="appointment-list">
      <table className="table">
        <tbody>
          <tr>
            <th>#</th>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>Banner id</th>
            <th>Location</th>
            <th>Visits</th>
            <th>Status</th>
            <th>&nbsp;</th>
          </tr>
          {listRows}
        </tbody>
      </table>
    </div>
  )
}

Appointment.propTypes = {
  appointments: PropTypes.array,
  reload: PropTypes.func
}

const AppointmentRow = (props) => {
  let count = props.count
  let _className = 'bg-' + props.color
  return (
    <tr className={_className}>
      <td>{count}</td>
      <td className="text-center">
        <CategoryIcon category={props.category} reasonTitle={props.reason_title}/></td>
      <td><VisitorName visitor={props.visitor}/></td>
      <td>
        <ClipboardInput bannerId={props.visitor.banner_id}/>
      </td>
      <td>{props.location}
      </td>
      <td><WaitingListVisits visitNumber={props.total_visits}/></td>
      <td>
        <WaitingListStatus
          visitor={props.visitor}
          reload={props.reload}
          visitNumber={props.total_visits}/>
      </td>
      <td><AppointmentAction visitId={props.id} reload={props.reload}/></td>
    </tr>
  )
}

AppointmentRow.propTypes = {
  id: PropTypes.string,
  category: PropTypes.string,
  color: PropTypes.string,
  reason_title: PropTypes.string,
  total_visits: PropTypes.string,
  visitor: PropTypes.object,
  visitor_id: PropTypes.string,
  reload: PropTypes.func,
  location: PropTypes.string,
  count: PropTypes.number
}

AppointmentRow.defaultProps = {
  id: 0,
  category: 0,
  color: 'default',
  reason_title: '',
  total_visits: 0,
  visitor: {},
  visitor_id: 0,
  reload: null
}

const AppointmentAction = (props) => {

  const completeReason = (reason) => {
    $.post('counseling/Admin/Dashboard/Waiting', {
      command: 'setCompleteReason',
      reason: reason,
      visitId: props.visitId
    }, null, 'json').done(function () {
      props.reload()
    }.bind(this))
  }

  const remove = () => {
    if (confirm('Are you sure you want to remove this visitor?')) {
      $.post('counseling/Admin/Dashboard/Waiting', {
        command: 'delete',
        visitId: props.visitId
      }, null, 'json').done(function () {
        props.reload()
      }.bind(this))
    }
  }

  const getOptions = () => {
    var options = []
    options.push(
      {
        label: <div className="text-success pointer">
          <strong>
            <i className="fas fa-thumbs-up"></i>&nbsp;Send back</strong>
        </div>,
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 5)
      },
      {
        divider: true
      },
      {
        label: <div className="pointer">
          <i className="fas fa-external-link-square-alt"></i>&nbsp;Had to leave</div>,
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 2)
      },
      {
        label: <div className="pointer">
          <i className="fa fa-user-plus"></i>&nbsp;Full, agreed to return</div>,
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 6)
      },
      {
        label: <div className="pointer">
          <i className="fa fa-eye-slash"></i>&nbsp;Missing</div>,
        visitId: props.visitId,
        handleClick: completeReason.bind(null, 3)
      },
      {
        divider: true
      },
      {
        label: <div className="text-danger pointer">
          <i className="far fa-trash-alt"></i>&nbsp;Remove</div>,
        visitId: props.visitId,
        handleClick: remove
      }
    )
    return options
  }

  var options = getOptions()
  const icon = <i className="fas fa-cog"></i>
  return <ButtonGroup label={icon} options={options}/>
}

AppointmentAction.propTypes = {
  visitId: PropTypes.string,
  reload: PropTypes.func
}

export default Appointment
