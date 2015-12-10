var Waiting = React.createClass({
    render: function() {
        if ( this.props.emergency === undefined && this.props.waiting === undefined ) {
            return <div className="text-muted text-center">
                <i style={{fontSize : '200px'}} className="fa fa-smile-o"></i>
                <p style={{fontSize : '100px'}}>All clear!</p>
            </div>;
        } else {
            return (
                <div>
                    <Emergency list={this.props.emergency} reload={this.props.reload}/>
                    <WaitingList list={this.props.waiting} reload={this.props.reload} />
                </div>
            );
        }
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
                <td style={{width : '3%'}} className="text-center"><CategoryIcon category={this.props.category} reasonTitle={this.props.reason_title}/></td>
                <td>{this.props.visitor.first_name} {this.props.visitor.last_name}</td>
                <td>{this.props.wait_time} min.</td>
                <td><WaitingListVisits visitNumber={this.props.total_visits} /></td>
                <td>
                    <WaitingListStatus intakeComplete={this.props.visitor.intake_complete}
                     previouslySeen={this.props.visitor.previously_seen} seenLastVisit={this.props.visitor.seen_last_visit}
                     visitorId={this.props.visitor.id}
                     reload={this.props.reload} visitNumber={this.props.total_visits}/>
                </td>
                 <td><WaitingAction visitId={this.props.id} reload={this.props.reload}/></td>
            </tr>
        );
    }

});

var CategoryIcon = React.createClass({
    getInitialState: function() {
        return {
            tooltip : true
        };
    },
    getDefaultProps: function() {
        return {
            category : 0,
            reasonTitle : null
        };
    },

    componentDidMount : function() {
        if (this.state.tooltip) {
            $('i.category').tooltip({animation:true, placement:'right'});
            this.setState({tooltip : false});
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
            visitNumber : 0,
            reload : null,
            previouslySeen : null
        };
    },

    intakeComplete : function()
    {
        if (confirm('Click OK if student completed their intake form.')) {
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
            if (this.props.visitNumber > 1) {
                if (this.props.seenLastVisit === '0') {
                    return <span className="label label-danger">Unseen last visit</span>;
                } else {
                    return <span className="label label-primary">Previously seen @ {this.props.previouslySeen}</span>;
                }
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

    completeReason : function(reason) {
        $.post('counseling/Admin/Dashboard/Waiting', {
        	command : 'setCompleteReason',
            reason : reason,
            visitId : this.props.visitId
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    remove : function() {
        if (confirm('Are you sure you want to remove this visitor?')) {
            $.post('counseling/Admin/Dashboard/Waiting', {
            	command : 'delete',
                visitId : this.props.visitId
            }, null, 'json')
            	.done(function(data){
                    this.props.reload();
            	}.bind(this));
        }
    },

    getOptions : function() {
        var options = [];
        options.push(
            {
                label : <div><i className="fa fa-external-link"></i> Had to leave</div>,
                visitId : this.props.visitId,
                handleClick : this.completeReason.bind(null, 2)
            },
            {
                label : <div><i className="fa fa-eye-slash"></i> Missing</div>,
                visitId : this.props.visitId,
                handleClick : this.completeReason.bind(null, 3)
            },
            {
                label : <div><i className="fa fa-clock-o"></i> Made appointment</div>,
                visitId : this.props.visitId,
                handleClick : this.completeReason.bind(null, 4)
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
