'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ClinicianListRow from './ClinicianListRow'
import ClinicianEditRow from './ClinicianEditRow'
import {sortable} from '../Mixins'
/* global $ */

export default class ClinicianList extends sortable {
  constructor(props) {
    super(props)
    this.state = {
      editRow: null,
      fail: false
    }
    this.updateSort = this.updateSort.bind(this)
    this.edit = this.edit.bind(this)
    this.deleteClinician = this.deleteClinician.bind(this)
    this.cancel = this.cancel.bind(this)
    this.fail = this.fail.bind(this)
  }

  componentDidMount() {
    this.loadSortable()
  }

  edit(key) {
    this.setState({editRow: key})
  }

  deleteClinician(cid) {
    $.post('counseling/Admin/Settings/Clinician', {
      command: 'delete',
      clinicianId: cid
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this))
  }

  cancel() {
    this.setState({editRow: null})
  }

  fail() {
    this.setState({fail: true})
  }

  updateSort(event, ui) {
    var moved = ui.item
    var movedId = parseInt(moved.data('rowid'), 10)

    var prevRow = ui.item.prev('tr.sorting-row')
    var prevRowId = parseInt(prevRow.data('rowid'), 10)

    var nextRow = ui.item.next('tr.sorting-row')
    var nextRowId = parseInt(nextRow.data('rowid'), 10)

    $(this.refs.sortRows).sortable('cancel')

    var newList = this.resortReact(this.props.clinicians, movedId, prevRowId, nextRowId)
    this.props.setClinicians(newList)

    $.post('counseling/Admin/Settings/Clinician', {
      command: 'sort',
      moved: movedId,
      next: nextRowId,
      prev: prevRowId
    }, null, 'json')
  }

  render() {
    var rows = null
    var failure = null

    if (this.props.clinicians !== null) {
      rows = this.props.clinicians.map(function (value) {
        if (this.state.editRow === value.id) {
          return <ClinicianEditRow
            key={value.id}
            {...value}
            cancel={this.cancel}
            reload={this.props.reload}
            fail={this.fail}/>
        } else {
          return <ClinicianListRow
            key={value.id}
            {...value}
            edit={this.edit.bind(null, value.id)}
            deleteClinician={this.deleteClinician}/>
        }
      }.bind(this))
    }

    if (this.state.fail) {
      failure = (
        <div className="alert alert-danger">
          <i className="fa fa-exclamation-triangle"></i>&nbsp; Failed to update clinician
        </div>
      )
    }
    return (
      <div id="sortBox">
        {failure}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody ref="sortRows">
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}

ClinicianList.propTypes = {
  clinicians: PropTypes.array,
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func,
  setClinicians: PropTypes.func,
}
