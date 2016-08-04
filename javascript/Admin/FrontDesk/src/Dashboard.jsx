var refreshDashboard = null;

var Dashboard = React.createClass({
    getInitialState: function() {
        return {
            refresh : true,
            emergencyList : null,
            waitingList : null,
            appointmentList: null,
            summary : null,
            currentlySeen: null,
            time : null
        };
    },

    componentDidMount : function() {
        this.loadData();
    },

    refresh : function() {
        if (this.state.refresh) {
            refreshDashboard = setInterval(function(){
                this.loadData();
            }.bind(this), 30000);
        }
    },

    loadData : function() {
        clearInterval(refreshDashboard);
        $.getJSON('counseling/Admin/Dashboard/Waiting', {
        	command : 'list'
        }).done(function(data){
            this.setState({
                emergencyList : data.emergencies,
                waitingList : data.waiting,
                appointmentList : data.appointment,
                summary : data.summary,
                currentlySeen: data.currentlySeen,
                time : data.time
            });
            this.refresh();
        }.bind(this));
    },

    render: function() {
        let visitors = null;
        if ( this.state.emergencyList === null && this.state.waitingList === null
            && this.appointmentList === null) {
            visitors = <div className="text-success text-center">
                <i style={{fontSize : '200px'}} className="fa fa-smile-o"></i>
                <p style={{fontSize : '100px'}}>All clear!</p>
            </div>;
        } else {
            visitors = (
                <div>
                    <Waiting emergency={this.state.emergencyList} waiting={this.state.waitingList}
                    reload={this.loadData}/>
                    <h3>Appointments</h3>
                    <Appointment appointments={this.state.appointmentList} reload={this.loadData}/>
                </div>
            );
        }
        return (
            <div className="dashboard">
                <Summary data={this.state.summary} time={this.state.time}
                    reload={this.loadData}/>
                <CurrentlySeen seen={this.state.currentlySeen} reload={this.loadData}/>
                {visitors}
            </div>
        );
    }

});

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'));
