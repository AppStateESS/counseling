'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const ClinicianListRow = ({
  id,
  deleteClinician,
  edit,
  first_name,
  last_name,
}) => {

  return (
    <tr className="sorting-row" data-rowid={id} id={id}>
      <td>
        <button className="btn btn-default btn-sm handle">
          <i className="fas fa-arrows-alt"></i>
        </button>&nbsp;
        <button
          className="btn btn-primary btn-sm"
          onClick={edit}
          title="Edit clinician">
          <i className="fa fa-edit"></i>
        </button>&nbsp;
        <button
          className="btn btn-danger btn-sm"
          onClick={deleteClinician.bind(null, id)}
          title="Delete clinician">
          <i className="fa fa-times"></i>
        </button>
      </td>
      <td>
        {first_name}&nbsp; {last_name}
      </td>
    </tr>
  )
}

ClinicianListRow.propTypes = {
  id: PropTypes.string,
  deleteClinician: PropTypes.func,
  edit: PropTypes.func,
  first_name: PropTypes.string,
  last_name: PropTypes.string
}

export default ClinicianListRow
