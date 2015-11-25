var ClinicianDashboard = React.createClass({
    getInitialState: function() {
        return {
            clinicians : null,
            timeframe : null,
            currentClinician : null,
            stage : 'choose'
        };
    },

    componentDidMount : function() {
        this.loadData();
        this.setTimeframe();
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
        }

        this.setState({
            timeframe : timeframe
        });
    },

    loadData : function() {
        $.getJSON('counseling/Admin/Clinician', {
        	command : 'list'
        }).done(function(data){
            this.setState({
                clinicians : data
            });
        }.bind(this));

    },

    choose : function(key) {
        this.setState({
            currentClinician : this.state.clinicians[key],
            stage : 'selectVisitor'
        });
    },

    render: function() {
        switch (this.state.stage) {
            case 'choose':
            return <ClinicianChoose clinicians={this.state.clinicians} choose={this.choose}/>
            break;

            case 'selectVisitor':
            return <SelectVisitor clinician={this.state.currentClinician} />
        }


    }

});


ReactDOM.render(<ClinicianDashboard/>, document.getElementById('clinician-dashboard'));
