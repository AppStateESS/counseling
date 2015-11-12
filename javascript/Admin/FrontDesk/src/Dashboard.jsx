var Dashboard = React.createClass({
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
