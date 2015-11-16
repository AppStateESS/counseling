var Summary = React.createClass({
    getInitialState: function() {
        return {
            error : null,
            errorMessage : null
        };
    },

    getDefaultProps: function() {
        return {
            data : null
        };
    },

    serverError : function() {
        this.setState({
            error : true,
            errorMessage : 'Could not retrieve server data'
        });
    },

    render: function() {
        var tally = null;
        if (this.props.data) {
            tally = this.props.data.currentTally;
        } else {
            tally = {
                        emergencies : 0,
                        walkin : 0,
                        appointment : 0,
                        other : 0
                    };
        }
        return (
            <div className="summary">
                {this.state.error ? <div className="alert alert-danger">{this.state.errorMessage}</div> : null}
                <div className="row">
                    <div className="col-sm-6 left">
                        <h3>Current</h3>
                        <div className="row">
                            <div className="col-sm-4">
                                <SummaryTotalWaiting {...this.props.data} />
                            </div>
                            <div className="col-sm-4">
                                <SummaryEstimatedWait {...this.props.data}/>
                            </div>
                            <div className="col-sm-4">
                                <SummaryWaitingTally {...tally}/>
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

    getDefaultProps: function() {
        return {
            totalWaiting : 0
        };
    },

    render: function() {
        return (
            <div className="total-waiting text-center">
                <div className="big-number">{this.props.totalWaiting}</div>
                <div>Waiting</div>
            </div>
        );
    }

});

var SummaryEstimatedWait = React.createClass({
    getDefaultProps: function() {
        return {
            estimatedWait : 0
        };
    },

    render: function() {
        return (
            <div className="estimated-wait text-center">
                <div>
                    <span className="big-number">{this.props.estimatedWait}</span>
                    <span>min</span>
                </div>
                <div>Est. Wait</div>
            </div>
        );
    }

});

var SummaryWaitingTally = React.createClass({
    getDefaultProps: function() {
        return {
            emergencies : 0,
            walkin : 0,
            appointment : 0,
            other : 0,
        };
    },

    render: function() {
        return (
            <div>
                <ul className="tally">
                    <li><i className="fa fa-exclamation-triangle"></i> Emergency {this.props.emergencies}</li>
                    <li><i className="fa fa-male"></i> Walk-in {this.props.walkin}</li>
                    <li><i className="fa fa-clock-o"></i> Appointment {this.props.appointment}</li>
                    <li><i className="fa fa-question-circle"></i> Other {this.props.other}</li>
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
                <SummaryWaitingTally />
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
