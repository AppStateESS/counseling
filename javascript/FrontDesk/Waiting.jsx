var Waiting = React.createClass({
    render: function() {
        let waitingList = <div>No walk-ins waiting</div>;
        if (!isEmpty(this.props.waiting)) {
            waitingList = (
                <div>
                    <WaitingList list={this.props.waiting} reload={this.props.reload}/>
                </div>
            );
        }
        return (
            <div>
                <Emergency list={this.props.emergency} reload={this.props.reload}/>
                <h3>Walk-ins</h3>
                {waitingList}
            </div>
        );
    }
});

var WaitingList = React.createClass({
    getDefaultProps: function() {
        return {list: null, reload: null};
    },

    render: function() {

        var listRows = null;
        if (this.props.list == null) {
            return <div/>;
        }
        listRows = this.props.list.map(function(value, key) {
            return (<WaitingListRow {...value} count={key} key={key} reload={this.props.reload}/>);
        }.bind(this));
        return (
            <div className="waiting-list">
                <table className="table">
                    <tbody>
                        <tr>
                            <th>#</th>
                            <th>&nbsp;</th>
                            <th>Name</th>
                            <th>Banner id</th>
                            <th>Wait time</th>
                            <th>Visits</th>
                            <th>Status</th>
                            <th>&nbsp;</th>
                        </tr>
                        {listRows}
                    </tbody>
                </table>
            </div>
        );
    }
});

var WaitingListRow = React.createClass({
    getDefaultProps: function() {
        return {value: {}, count: 0, reload: null, visitor: null};
    },

    render: function() {
        let count = this.props.count + 1;
        let _className = 'bg-' + this.props.color;
        return (
            <tr className={_className}>
                <td style={{
                    width: '3%'
                }}>{count}</td>
                <td
                    style={{
                        width: '3%'
                    }}
                    className="text-center">
                    <CategoryIcon
                        category={this.props.category}
                        reasonTitle={this.props.reason_title}/></td>
                <td><VisitorName visitor={this.props.visitor}/></td>
                <td>
                    <ClipboardInput bannerId={this.props.visitor.banner_id}/>
                </td>
                <td>{this.props.wait_time}
                min.</td>
                <td><WaitingListVisits visitNumber={this.props.total_visits}/></td>
                <td>
                    <WaitingListStatus
                        visitor={this.props.visitor}
                        reload={this.props.reload}
                        visitNumber={this.props.total_visits}/>
                </td>
                <td><WaitingAction visitId={this.props.id} reload={this.props.reload}/></td>
            </tr>
        );
    }
});

var VisitorName = React.createClass({
    getInitialState: function() {
        return {tooltip: true};
    },

    getDefaultProps: function() {
        return {visitor: null};
    },

    componentDidMount: function() {
        if (this.state.tooltip) {
            $('span.visitor-name').tooltip({animation: true, placement: 'right'});
            this.setState({tooltip: false});
        }
    },

    render: function() {
        if (this.props.visitor.preferred_name) {
            var fullName = this.props.visitor.first_name + ' "' + this.props.visitor.preferred_name + '" ' + this.props.visitor.last_name;
            return (
                <span className='visitor-name' data-toggle="tooltip" title={fullName}>{this.props.visitor.preferred_name} {this.props.visitor.last_name}</span>
            );
        } else {
            return (
                <span>{this.props.visitor.first_name} {this.props.visitor.last_name}</span>
            );
        }
    }
});

var CategoryIcon = React.createClass({
    getInitialState: function() {
        return {tooltip: true};
    },
    getDefaultProps: function() {
        return {category: 0, reasonTitle: null};
    },

    componentDidMount: function() {
        if (this.state.tooltip) {
            $('i.category').tooltip({animation: true, placement: 'right'});
            this.setState({tooltip: false});
        }
    },

    render: function() {
        var icon = null;
        var _className = 'category fa fa-lg ' + categoryIcons[this.props.category];
        icon = <i className={_className} data-toggle="tooltip" title={this.props.reasonTitle}></i>;
        return (
            <div>{icon}</div>
        );
    }
});

var WaitingListVisits = React.createClass({

    getDefaultProps: function() {
        return {visitNumber: '0'};
    },

    render: function() {
        switch (this.props.visitNumber) {
            case '0':
                return <span></span>;

            case '1':
                return <span className="label label-info">First visit</span>;

            case '2':
            case '3':
                return <span className="label label-primary">{this.props.visitNumber}&nbsp;
                    visits</span>;

            case '4':
            case '5':
                return <span className="label label-warning">{this.props.visitNumber}&nbsp;
                    visits</span>;

            default:
                return <span className="label label-danger">{this.props.visitNumber}&nbsp;
                    visits</span>;
        }

    }
});

var WaitingAction = React.createClass({

    getDefaultProps: function() {
        return {visitId: 0};
    },

    completeReason: function(reason) {
        $.post('counseling/Admin/Dashboard/Waiting', {
            command: 'setCompleteReason',
            reason: reason,
            visitId: this.props.visitId
        }, null, 'json').done(function(data) {
            this.props.reload();
        }.bind(this));
    },

    remove: function() {
        if (confirm('Are you sure you want to remove this visitor?')) {
            $.post('counseling/Admin/Dashboard/Waiting', {
                command: 'delete',
                visitId: this.props.visitId
            }, null, 'json').done(function(data) {
                this.props.reload();
            }.bind(this));
        }
    },

    getOptions: function() {
        var options = [];
        options.push({
            label: <div>
                <i className="fa fa-external-link"></i>&nbsp; Had to leave</div>,
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 2)
        }, {
            label: <div>
                <i className="fa fa-eye-slash"></i>&nbsp; Missing</div>,
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 3)
        }, {
            label: <div>
                <i className="fa fa-clock-o"></i>&nbsp; Made appointment</div>,
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 4)
        }, {
            divider: true
        }, {
            label: <div className="text-danger">
                <i className="fa fa-trash-o"></i>&nbsp; Remove</div>,
            visitId: this.props.visitId,
            handleClick: this.remove
        });
        return options;
    },

    render: function() {
        var options = this.getOptions();
        return (<ButtonGroup options={options}/>);
    }
});
