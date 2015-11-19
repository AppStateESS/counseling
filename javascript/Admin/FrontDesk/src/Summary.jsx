var Summary = React.createClass({
    getInitialState: function() {
        return {error: null, errorMessage: null};
    },

    getDefaultProps: function() {
        return {data: null};
    },

    serverError: function() {
        this.setState({error: true, errorMessage: 'Could not retrieve server data'});
    },

    render: function() {
        var tally = null;
        if (this.props.data) {
            currentTally = this.props.data.currentTally;
            totalTally = this.props.data.completeTally;
        } else {
            currentTally = {
                emergencies: 0,
                walkin: 0,
                appointment: 0,
                other: 0
            };
            totalTally = currentTally;
        }
        return (
            <div className="summary">
                {this.state.error
                    ? <div className="alert alert-danger">{this.state.errorMessage}</div>
                    : null}
                <div className="row">
                    <div className="col-sm-6 left">
                        <h3>Current</h3>
                        <div className="row">
                            <div className="col-sm-4">
                                <SummaryTotalWaiting {...this.props.data}/>
                            </div>
                            <div className="col-sm-4">
                                <SummaryEstimatedWait {...this.props.data}/>
                            </div>
                            <div className="col-sm-4">
                                <SummaryWaitingTally {...currentTally}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 right">
                        <h3>Today</h3>
                        <div className="row">
                            <div className="col-sm-3">
                                <SummaryTotalSeen {...this.props.data}/>
                            </div>
                            <div className="col-sm-3">
                                <SummaryCompleted {...this.props.data}/>
                            </div>
                            <div className="col-sm-3">
                                <SummaryAverageWait {...this.props.data}/>
                            </div>
                            <div className="col-sm-3">
                                <SummaryWaitingTally {...totalTally} showLabels={false}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});


var SummaryCompleted = React.createClass({

    getDefaultProps: function() {
        return {totalComplete: 0};
    },

    render: function() {
        return (
            <div className="total-seen text-center">
                <div className="big-number">{this.props.totalComplete}</div>
                <div>Visits</div>
            </div>
        );
    }

});

var SummaryTotalWaiting = React.createClass({

    getDefaultProps: function() {
        return {totalWaiting: 0};
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
        return {estimatedWait: 0};
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
        return {emergency: 0, walkin: 0, appointment: 0, other: 0, showLabels : true};
    },

    render: function() {
        return (
            <div>
                <table className="tally">
                    <tbody>
                        <tr>
                            <td className="text-center">
                                <i className="fa fa-exclamation-triangle"></i>
                            </td>
                            {this.props.showLabels ? <td>Emergency</td> : null}
                            <td>{this.props.emergency}</td>
                        </tr>
                        <tr>
                            <td className="text-center">
                                <i className="fa fa-male"></i>
                            </td>
                            {this.props.showLabels ? <td>Walk-in</td> : null}
                            <td>{this.props.walkin}</td>
                        </tr>
                        <tr>
                            <td className="text-center">
                                <i className="fa fa-clock-o"></i>
                            </td>
                            {this.props.showLabels ? <td>Appointment</td> : null}
                            <td>{this.props.appointment}</td>
                        </tr>
                        <tr>
                            <td className="text-center">
                                <i className="fa fa-question-circle"></i>
                            </td>
                            {this.props.showLabels ? <td>Other</td> : null}
                            <td>{this.props.other}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

});

var SummaryTotalSeen = React.createClass({

    getDefaultProps: function() {
        return {totalSeen: 0};
    },

    render: function() {
        return (
            <div className="total-seen text-center">
                <div className="big-number">{this.props.totalSeen}</div>
                <div>Seen</div>
            </div>
        );
    }

});

var SummaryAverageWait = React.createClass({
    getDefaultProps: function() {
        return {averageWait: 0};
    },

    render: function() {
        return (
            <div className="average-wait text-center">
                <div>
                    <span className="big-number">{this.props.averageWait}</span>
                    <span>min</span>
                </div>
                <div>Avg. Wait</div>
            </div>
        );
    }

});
