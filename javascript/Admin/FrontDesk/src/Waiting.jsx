var Waiting = React.createClass({
    getInitialState: function() {
        return {
            emergencyList : null,
            waitingList : null
        };
    },

    componentDidMount : function() {
        $.getJSON('counseling/Admin/Dashboard/Waiting', {
        	command : 'list'
        }).done(function(data){
        	console.log(data);
        }.bind(this));

    },

    render: function() {
        // var emergencyList = this.state.emergencyList;
        var emergencyList = [
            {
                visitor : 'Tom Smith',
                waiting : 10
            },
            {
                visitor : 'Jacob Jones',
                waiting : 8
            }
        ];


        return (
            <div>
                <Emergency list={emergencyList}/>
                <WaitingList />
            </div>
        );
    }
});

var WaitingList = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        return (
            <div className="waiting-list">
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th>#</th>
                            <th>&nbsp;</th>
                            <th>Name</th>
                            <th>Wait time</th>
                            <th>Visits</th>
                            <th>Status</th>
                            <th>&nbsp;</th>
                        </tr>
                        <WaitingListRow />
                    </tbody>
                </table>
            </div>
        );
    }
});

var WaitingListRow = React.createClass({

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        return (
            <tr>
                <td>1</td>
                <td><i className="fa fa-man"></i></td>
                <td>Mark Johnson</td>
                <td>45</td>
                <td><WaitingListVisits visitNumber="7"/></td>
                <td><WaitingListStatus intakeComplete={true} seenLastVisit={false} /></td>
                <td><WaitingAction /></td>
            </tr>
        );
    }

});

var WaitingListVisits = React.createClass({

    getDefaultProps: function() {
        return {
            visitNumber : '0'
        };
    },

    render: function() {
        switch (this.props.visitNumber) {
            case '0':
                return <span></span>;s

            case '1':
                return <span className="label label-info">First visit</span>;

            case '2':
            case '3':
                return <span className="label label-primary">{this.props.visitNumber} visits</span>;

            case '4':
            case '5':
                return <span className="label label-warning">{this.props.visitNumber} visits</span>;

            default:
                return <span className="label label-danger">{this.props.visitNumber} visits</span>;
        }

    }

});

var WaitingListStatus = React.createClass({

    getDefaultProps: function() {
        return {
            intakeComplete : false,
            seenLastVisit : false
        };
    },

    render: function() {
        if (this.props.intakeComplete === true) {
            if (this.props.seenLastVisit === true) {
                return <span className="label label-danger">Unseen last visit</span>
            } else {
                return <span className="label label-success">Intake complete</span>
            }
        } else {
            return <span className="label label-danger">Intake incomplete</span>
        }
    }

});

var WaitingAction = React.createClass({

    getDefaultProps: function() {
        return {
        };
    },

    getOptions : function() {
        var options = [];
        options.push(
            {
                label : <div><i className="fa fa-external-link"></i> Had to leave</div>,
                handleClick : null
            },
            {
                label : <div><i className="fa fa-eye-slash"></i> Missing</div>,
                handleClick : null
            },
            {
                label : <div><i className="fa fa-clock-o"></i> Made appointment</div>,
                handleClick : null
            },
            {
                divider : true
            },
            {
                label : <div className="text-success"><i className="fa fa-thumbs-o-up"></i> Seen</div>,
                handleClick : null
            },
            {
                divider : true
            },
            {
                label : <div className="text-danger"><i className="fa fa-trash-o"></i> Remove</div>,
                handleClick : null
            }
        );
        return options;
    },

    render: function() {
        var options = this.getOptions();
        return (
            <ButtonGroup options={options}/>
        );
    }

});
