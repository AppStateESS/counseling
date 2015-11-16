var Waiting = React.createClass({

    render: function() {
        return (
            <div>
                <Emergency list={this.props.emergency} reload={this.props.reload}/>
                <WaitingList list={this.props.waiting} reload={this.props.reload} />
            </div>
        );
    }
});

var WaitingList = React.createClass({
    getDefaultProps: function() {
        return {
            list : null,
            reload : null
        };
    },

    render: function() {

        var listRows = null;
        if (this.props.list == null) {
            return <div />;
        }
        listRows = this.props.list.map(function(value, key){
            return (
                <WaitingListRow {...value} count={key} key={key} reload={this.props.reload}/>
            );
        }.bind(this));
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
                        {listRows}
                    </tbody>
                </table>
            </div>
        );
    }
});

var WaitingListRow = React.createClass({

    getDefaultProps: function() {
        return {
            value : {},
            count : 0,
            reload : null
        };
    },

    render: function() {
        var count = this.props.count + 1;
        return (
            <tr>
                <td style={{width : '3%'}}>{count}</td>
                <td style={{width : '3%'}} className="text-center"><CategoryIcon category={this.props.category}/></td>
                <td>{this.props.visitor.first_name} {this.props.visitor.last_name}</td>
                <td>{this.props.wait_time} min.</td>
                <td><WaitingListVisits visitNumber={this.props.total_visits} /></td>
                <td>
                    <WaitingListStatus intakeComplete={this.props.visitor.intake_complete}
                     seenLastVisit={this.props.visitor.previously_seen} visitorId={this.props.visitor.id}
                     reload={this.props.reload}/>
                </td>
                 <td><WaitingAction visitId={this.props.visit_id}/></td>
            </tr>
        );
    }

});

var CategoryIcon = React.createClass({
    getDefaultProps: function() {
        return {
            category : 0
        };
    },

    render: function() {
        var icon = null;
        var _className = 'fa fa-lg ' + categoryIcons[this.props.category];
        icon = <i className={_className}></i>;
        return (
            <div>{icon}</div>
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
                return <span></span>;

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
            intakeComplete : '0',
            seenLastVisit : '0',
            visitorId : 0,
            reload : null
        };
    },

    intakeComplete : function()
    {
        if (confirm('Has the student completed their intake form?')) {
             $.post('counseling/Admin/Dashboard/Waiting/', {
             	command : 'intakeComplete',
                visitorId : this.props.visitorId
             }, null, 'json')
             	.done(function(data){
                    this.props.reload();
             	}.bind(this));
        }

    },

    render: function() {
        if (this.props.intakeComplete === '1') {
            if (this.props.seenLastVisit === '1') {
                return <span className="label label-danger">Unseen last visit</span>
            } else {
                return <span className="label label-success">Intake complete</span>
            }
        } else {
            return <span className="label label-danger" style={{cursor:'pointer'}} title="Click to acknowledge intake completion" onClick={this.intakeComplete}>Intake incomplete</span>
        }
    }

});

var WaitingAction = React.createClass({

    getDefaultProps: function() {
        return {
            visitId : 0
        };
    },

    leave : function() {

    },

    missing : function() {

    },

    appointment : function() {

    },

    seen : function() {

    },

    remove : function() {

    },

    getOptions : function() {
        var options = [];
        options.push(
            {
                label : <div><i className="fa fa-external-link"></i> Had to leave</div>,
                visitId : this.props.visitId,
                handleClick : this.leave
            },
            {
                label : <div><i className="fa fa-eye-slash"></i> Missing</div>,
                visitId : this.props.visitId,
                handleClick : this.missing
            },
            {
                label : <div><i className="fa fa-clock-o"></i> Made appointment</div>,
                visitId : this.props.visitId,
                handleClick : this.appointment
            },
            {
                divider : true
            },
            {
                label : <div className="text-success"><i className="fa fa-thumbs-o-up"></i> Seen</div>,
                visitId : this.props.visitId,
                handleClick : this.seen
            },
            {
                divider : true
            },
            {
                label : <div className="text-danger"><i className="fa fa-trash-o"></i> Remove</div>,
                visitId : this.props.visitId,
                handleClick : this.remove
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
