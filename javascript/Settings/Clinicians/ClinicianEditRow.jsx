'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ClinicianForm from './ClinicianForm'

const ClinicianEditRow = ({
  first_name,
  last_name,
  cancel,
  fail,
  reload,
  id
}) => {
  return (
    <tr>
      <td colSpan="2">
        <ClinicianForm
          closeForm={cancel}
          reload={reload}
          fail={fail}
          firstName={first_name}
          lastName={last_name}
          clinicianId={id}/>
      </td>
    </tr>
  )
}

ClinicianEditRow.propTypes = {
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  cancel: PropTypes.func,
  fail: PropTypes.func,
  reload: PropTypes.func,
  id: PropTypes.string,
}

export default ClinicianEditRow
