import React from 'react'
import PropTypes from 'prop-types'

const SummaryWaitingTally = (props) => {
  return (
    <div>
      <table className="tally">
        <tbody>
          <tr>
            <td className="text-center">
              <i className="fa fa-exclamation-triangle"></i>
            </td>
            {props.showLabels
              ? <td>Emergency</td>
              : null}
            <td>{props.emergency}</td>
          </tr>
          <tr>
            <td className="text-center">
              <i className="fa fa-male"></i>
            </td>
            {props.showLabels
              ? <td>Walk-in</td>
              : null}
            <td>{props.walkin}</td>
          </tr>
          <tr>
            <td className="text-center">
              <i className="fa fa-clock-o"></i>
            </td>
            {props.showLabels
              ? <td>Appointment</td>
              : null}
            <td>{props.appointment}</td>
          </tr>
          <tr>
            <td className="text-center">
              <i className="fa fa-question-circle"></i>
            </td>
            {props.showLabels
              ? <td>Other</td>
              : null}
            <td>{props.other}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

SummaryWaitingTally.defaultProps = {
  emergency: 0,
  walkin: 0,
  appointment: 0,
  other: 0,
  showLabels: true,
}

SummaryWaitingTally.propTypes = {
  emergency: PropTypes.number,
  walkin: PropTypes.number,
  appointment: PropTypes.number,
  other: PropTypes.number,
  showLabels: PropTypes.bool,
}

export default SummaryWaitingTally
