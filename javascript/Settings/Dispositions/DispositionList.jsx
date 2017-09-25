'use strict'
import React  from 'react'
import {sortable} from '../Mixins'
import DispositionListRow from './DispositionListRow'
import DispositionEditRow from './DispositionEditRow'

/* global $ */

export default class DispositionList extends sortable {

  constructor(props) {
    super(props)
    this.state = {
      editRow: null,
      fail: false,
    }
    this.edit = this.edit.bind(this)
    this.delete = this.delete.bind(this)
    this.fail = this.fail.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  edit(key) {
    this.setState({editRow: key})
  }

  delete(did) {
    $.post('counseling/Admin/Settings/Disposition', {
      command: 'delete',
      dispositionId: did,
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

  componentDidMount() {
    this.loadSortable('#disposition-listing')
  }

  updateSort(event, ui) {
    const moved = ui.item
    const movedId = parseInt(moved.data('rowid'), 10)

    const prevRow = ui.item.prev('tr.sorting-row')
    const prevRowId = parseInt(prevRow.data('rowid'), 10)

    const nextRow = ui.item.next('tr.sorting-row')
    const nextRowId = parseInt(nextRow.data('rowid'), 10)

    $(this.refs.sortRows).sortable('cancel')

    const newList = this.resortReact(this.props.dispositions, movedId, prevRowId, nextRowId)
    this.props.setDispositions(newList)

    $.post('counseling/Admin/Settings/Disposition', {
      command: 'sort',
      moved: movedId,
      next: nextRowId,
      prev: prevRowId,
    }, null, 'json')
  }

  render() {
    let rows = null
    let failure = null
    if (this.props.dispositions !== null) {
      rows = this.props.dispositions.map(function (value, key) {
        if (this.state.editRow === key) {
          return <DispositionEditRow
            key={key}
            {...value}
            cancel={this.cancel}
            reload={this.props.reload}
            fail={this.fail}/>
        } else {
          return <DispositionListRow
            key={key}
            {...value}
            edit={this.edit.bind(null, key)}
            delete={this.delete}/>
        }
      }.bind(this))
    }

    if (this.state.fail) {
      failure = (
        <div className="alert alert-danger">
          <i className="fa fa-exclamation-triangle"></i>&nbsp; Failed to update disposition
        </div>
      )
    }
    return (
      <div id="sortBox">
        {failure}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Action</th>
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
