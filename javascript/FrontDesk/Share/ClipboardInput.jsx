'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $ */

class ClipboardInput extends Component {
  constructor(props) {
    super(props)
  }
  /*
  * silences javascript warning on input used for copy and paste
  * update: this looks kludgy. revisit.
  */
  saveToClipboard() {
    $(this.refs.bannerId).select()
    document.execCommand('copy')
  }
  nada() {}

  render() {
    return (
      <div>
        <input size="11" ref="bannerId" value={this.props.bannerId} onChange={this.nada}/>&nbsp;
        <button title="Copy to clipboard" onClick={this.saveToClipboard}>
          <i className="far fa-copy"></i>
        </button>
      </div>
    )
  }
}

ClipboardInput.propTypes = {
  bannerId: PropTypes.string
}

export default ClipboardInput
