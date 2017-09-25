var ClinicianTimeout = null;

var ClinicianDashboard = React.createClass({
    getInitialState: function() {
        return {
            clinicians : null,
            currentClinician : null,
            stage : 'choose',
            currentlySeen : null
        };
    },

    componentDidMount : function() {
        this.loadData();
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

    loadSeen : function(clinician) {
        $.getJSON('counseling/Admin/Clinician', {
        	command : 'currentlySeen',
            clinicianId : clinician.id
        }).done(function(data){
            if (data !== false) {
                this.setState({
                    currentlySeen : data,
                    stage : 'completeVisit',
                    currentClinician : clinician
                });
            } else {
                this.setState({
                    currentlySeen : null,
                    stage : 'selectVisitor',
                    currentClinician : clinician
                });
            }
        }.bind(this));

    },

    choose : function(key) {
        var clinician = this.state.clinicians[key];
        this.loadSeen(clinician);
    },

    setStage : function(stage) {
        this.setState({
            stage : stage
        });
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.stage == 'reset') {
            ClinicianTimeout = setTimeout(function(){
                this.setStage('choose');
            }.bind(this), 5000);
        }
    },

    goBack : function() {
        clearTimeout(ClinicianTimeout);
        this.setStage('choose');
    },

    render: function() {
        switch (this.state.stage) {
            case 'choose':
            return <ClinicianChoose clinicians={this.state.clinicians} choose={this.choose}/>
            break;

            case 'selectVisitor':
            return <SelectVisitor clinician={this.state.currentClinician} setStage={this.setStage}/>
            break;

            case 'completeVisit':
            return <CompleteVisit clinician={this.state.currentClinician} seen={this.state.currentlySeen} goBack={this.goBack} setStage={this.setStage}/>
            break;

            case 'reset':
            return (
                <div className="well text-center">
                    <h2>Thank you.</h2>
                    <h3>Return on completion of your consultation.</h3>
                    <button className="btn btn-default btn-lg" onClick={this.goBack}><i className="fa fa-undo"></i> Go Back</button>
                </div>);
        }
    }

});

ReactDOM.render(<ClinicianDashboard/>, document.getElementById('clinician-dashboard'));
