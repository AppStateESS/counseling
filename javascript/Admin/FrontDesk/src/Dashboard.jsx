var Dashboard = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    render: function() {
        return (
            <div className="dashboard">
                <Summary />
                <Waiting />
            </div>
        );
    }

});

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'));
