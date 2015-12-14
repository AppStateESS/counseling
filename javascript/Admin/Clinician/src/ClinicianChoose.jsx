var ClinicianChoose = React.createClass({
    getInitialState: function() {
        return {
            timeframe : null
        };
    },

    componentDidMount: function() {
        this.setTimeframe();
    },

    getDefaultProps: function() {
        return {
            clinicians : null,
            choose : null
        };
    },

    setTimeframe : function() {
        var timeframe;
        var date = new Date();
        var hours = date.getHours();
        switch (hours) {
            case hours < 12:
            timeframe = 'Morning';
            break;

            case hours > 17:
            timeframe = 'Evening';
            break;

            default:
            timeframe = 'Afternoon';
            break;
        }
        this.setState({
            timeframe : timeframe
        });
    },

    render: function() {
        var rows = null;

        if (this.props.clinicians !== null && this.props.clinicians.length > 0) {
            rows = this.props.clinicians.map(function(value, key){
                return <ClinicianRow key={key} {...value} choose={this.props.choose.bind(null, key)}/>;
            }.bind(this));
        } else {
            rows = <p>No clinicians found in system.</p>;
        }

        return (
            <div>
                <h2>Good {this.state.timeframe}!</h2>
                <hr />
                <h3>Please click/touch your name to continue...</h3>
                <div className="row clinician-container">
                    {rows}
                </div>
            </div>
        );
    }

});

var ClinicianRow = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            first_name : null,
            last_name : null,
            id : null,
            choose : null
        };
    },

    render: function() {
        return (
            <div className="col-sm-6 col-md-4">
                <button className="clinician btn btn-primary btn-lg btn-block" onClick={this.props.choose}>{this.props.first_name}&nbsp;{this.props.last_name}</button>
            </div>
        );
    }

});
