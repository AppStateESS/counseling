var refreshDashboard = null;

var Dashboard = React.createClass({
    getInitialState: function() {
        return {
            refresh : true,
            emergencyList : null,
            waitingList : null,
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
                summary : data.summary,
                currentlySeen: data.currentlySeen,
                time : data.time
            });
            this.refresh();
        }.bind(this));
    },

    render: function() {
        return (
            <div className="dashboard">
                <Summary data={this.state.summary} time={this.state.time} reload={this.loadData}/>
                <CurrentlySeen seen={this.state.currentlySeen} reload={this.loadData}/>
                <Waiting emergency={this.state.emergencyList} waiting={this.state.waitingList} reload={this.loadData}/>
            </div>
        );
    }

});

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'));
