'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class DispositionListRow extends Component {
  constructor(props) {
    super(props)
    this.deleteCheck = this.deleteCheck.bind(this)
  }

  deleteCheck() {
    if (window.confirm('Are you sure you want to remove this disposition?')) {
      this.props.delete(this.props.id)
    }
  }

  render() {
    const iconClass = 'fa fa-' + this.props.icon
    const buttonClass = 'btn btn-block btn-' + this.props.color

    return (
      <tr className="sorting-row" data-rowid={this.props.id} id={this.props.id}>
        <td className="col-xs-3">
          <button className="btn btn-default handle">
            <i className="fas fa-arrows-alt"></i>
          </button>&nbsp;
          <button
            className="btn btn-primary btn-sm"
            onClick={this.props.edit}
            title="Edit disposition">
            <i className="fa fa-edit"></i>
          </button>&nbsp;
          <button
            className="btn btn-danger btn-sm"
            onClick={this.deleteCheck}
            title="Delete disposition">
            <i className="fa fa-times"></i>
          </button>
        </td>
        <td>
          <button className={buttonClass}>
            <i className={iconClass}></i>&nbsp;{this.props.title}</button>
        </td>
      </tr>
    )
  }
}

DispositionListRow.propTypes = {
  color : PropTypes.string,
  id: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  edit: PropTypes.func,
  delete: PropTypes.func,
}

DispositionListRow.defaultProps = {
  icon: 'fa-times',
  color: 'default'
}
