var ButtonGroup = React.createClass({
    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {
            label: 'Action',
            options: [
                {
                    label: 'Action1',
                    handleClick: null,
                    divider: false,
                },
            ],
        };
    },

    render: function() {
        var options = this.props.options.map(function(value, key) {
            return <ButtonGroupOption
                key={key}
                label={value.label}
                handleClick={value.handleClick}
                divider={value.divider}/>;
        });

        return (
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-default btn-sm dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    {this.props.label}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {options}
                </ul>
            </div>
        );
    },
});

var ButtonGroupOption = React.createClass({
    getDefaultProps: function() {
        return {label: null, handleClick: null, divider: false,};
    },

    render: function() {
        if (this.props.divider) {
            return (
                <li role="separator" className="divider"></li>
            );
        } else {
            return (
                <li onClick={this.props.handleClick}>
                    <a style={{
                        cursor: 'pointer'
                    }}>{this.props.label}</a>
                </li>
            );
        }
    },
});

var WaitingListStatus = React.createClass({

    getDefaultProps: function() {
        return {visitor: null, visitNumber: 0, reload: null};
    },

    intakeComplete: function() {
        if (confirm('Click OK if student completed their intake form.')) {
            $.post('counseling/Admin/Dashboard/Waiting/', {
                command: 'intakeComplete',
                visitorId: this.props.visitor.id,
            }, null, 'json').done(function(data) {
                this.props.reload();
            }.bind(this));
        }

    },

    render: function() {
        if (this.props.visitor.intake_complete === '1') {
            if (this.props.visitNumber > 1) {
                if (this.props.visitor.seen_last_visit === '0') {
                    return <span className="label label-danger">Unseen last visit</span>;
                } else {
                    return (
                        <span className="label label-primary">
                            Previously seen @ {this.props.visitor.previously_seen}
                        </span>
                    );
                }
            } else {
                return <span className="label label-success">Intake complete</span>
            }
        } else {
            return <span
                className="label label-danger"
                style={{
                cursor: 'pointer'
            }}
                title="Click to acknowledge intake completion"
                onClick={this.intakeComplete}>Intake incomplete</span>
        }
    },
});

var ClipboardInput = React.createClass({
    /*
    * silences javascript warning on input used for copy and paste
    */
    saveToClipboard: function() {
        $(this.refs.bannerId).select();
        document.execCommand('copy');
    },

    nada: function() {},

    render: function() {
        return (
            <div>
                <input
                    size="11"
                    ref="bannerId"
                    value={this.props.bannerId}
                    onChange={this.nada}/>&nbsp;
                <button title="Copy to clipboard" onClick={this.saveToClipboard}>
                    <i className="glyphicon glyphicon-copy"></i>
                </button>
            </div>
        );
    },
});

let isEmpty = function(value) {
    return (value === undefined || value === null || value.length === 0);
};
