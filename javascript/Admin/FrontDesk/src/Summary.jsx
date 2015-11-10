var Summary = React.createClass({
    getInitialState: function() {
        return {
            totalWaiting : 0,
            estimatedWait : 0,
            waitingTally : null,
            totalSeen : null,
            averageWait : 0,
            error : false,
            errorMessage : null,
            seenTally : null
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    componentDidMount : function() {
        this.loadData();
    },

    serverError : function() {
        this.setState({
            error : true,
            errorMessage : 'Could not retrieve server data'
        });
    },

    loadData : function() {
        $.getJSON('counseling/Admin/Dashboard/Summary', {
        	command : 'getData'
        }).done(function(data){
            if (data === null || data.length === 0) {
                this.serverError();
            }
            //console.log(data);
        }.bind(this)).fail(function(data){
            this.serverError();
        });

    },

    render: function() {
        return (
            <div className="summary">
                {this.state.error ? <div className="alert alert-danger">{this.state.errorMessage}</div> : null}
                <div className="row">
                    <div className="col-sm-6 left">
                        <h3>Current</h3>
                        <div className="row">
                            <div className="col-sm-4">
                                <SummaryTotalWaiting />
                            </div>
                            <div className="col-sm-4">
                                <SummaryEstimatedWait />
                            </div>
                            <div className="col-sm-4">
                                <SummaryWaitingTally />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 right">
                        <h3>Today</h3>
                        <div className="row">
                            <div className="col-sm-4">
                                <SummaryAverageWait />
                            </div>
                            <div className="col-sm-4">
                                <SummaryTotalSeen />
                            </div>
                            <div className="col-sm-4">
                                <SummarySeenTally />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

var SummaryTotalWaiting = React.createClass({
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
            <div className="total-waiting text-center">
                <div className="big-number">3</div>
                <div>Waiting</div>
            </div>
        );
    }

});

var SummaryEstimatedWait = React.createClass({
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
            <div className="estimated-wait text-center">
                <div>
                    <span className="big-number">40</span>
                    <span>min</span>
                </div>
                <div>Est. Wait</div>
            </div>
        );
    }

});

var SummaryWaitingTally = React.createClass({
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
            <div className="waiting-tally tally">
                <SummaryWaitingTallyRow />
            </div>
        );
    }

});

var SummaryWaitingTallyRow = React.createClass({
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
            <div>
                <ul>
                    <li><i className="fa fa-exclamation-triangle"></i> Emergency 1</li>
                    <li><i className="fa fa-male"></i> Walk-in 2</li>
                    <li><i className="fa fa-clock-o"></i> Appointment 1</li>
                    <li><i className="fa fa-question-circle"></i> Other 0</li>
                </ul>
            </div>
        );
    }

});

var SummarySeenTally = React.createClass({
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
            <div className="seen-tally tally">
                <SummaryWaitingTallyRow />
            </div>
        );
    }

});

var SummaryTotalSeen = React.createClass({
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
            <div className="total-seen text-center">
                <div className="big-number">13</div>
                <div>Seen</div>
            </div>
        );
    }

});

var SummaryAverageWait = React.createClass({
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
            <div className="average-wait text-center">
                <div><span className="big-number">32</span><span>min</span></div>
                <div>Avg. Wait</div>
            </div>
        );
    }

});
