import React, {Component} from 'react'
import PropTypes from 'prop-types'
/* global $ */

class VisitorName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tooltip: true
    }
  }

  componentDidMount() {
    if (this.state.tooltip) {
      $('span.visitor-name').tooltip({animation: true, placement: 'right',})
      this.setState({tooltip: false})
    }
  }

  render() {
    if (this.props.visitor.preferred_name) {
      var fullName = this.props.visitor.first_name + ' "' + this.props.visitor.preferred_name + '" ' + this.props.visitor.last_name
      return (
        <span className="visitor-name" data-toggle="tooltip" title={fullName}>{this.props.visitor.preferred_name} {this.props.visitor.last_name}</span>
      )
    } else {
      return (
        <span>{this.props.visitor.first_name} {this.props.visitor.last_name}</span>
      )
    }
  }
}

VisitorName.propTypes = {
  visitor: PropTypes.object
}

export default VisitorName
