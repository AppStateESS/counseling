var Dashboard = React.createClass({
    getInitialState: function() {
        return {
            emergencyList : null,
            waitingList : null,
            summary : null
        };
    },

    componentDidMount : function() {
        this.loadData();
    },

    loadData : function() {
        $.getJSON('counseling/Admin/Dashboard/Waiting', {
        	command : 'list'
        }).done(function(data){
            this.setState({
                emergencyList : data.emergencies,
                waitingList : data.waiting,
                summary : data.summary
            });
        }.bind(this));
    },

    render: function() {
        return (
            <div className="dashboard">
                <Summary data={this.state.summary} reload={this.loadData}/>
                <Waiting emergency={this.state.emergencyList} waiting={this.state.waitingList} reload={this.loadData}/>
            </div>
        );
    }

});

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'));
