var Dashboard = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    render: function() {
        return (
            <div>
                {settingsAllowed ? <a href="counseling/Admin/Settings" className="btn btn-default"><i className="fa fa-gear"></i> Settings</a> : null}
                <Summary />
                <Emergency />
                <Waiting />
            </div>
        );
    }

});

var Emergency = React.createClass({
    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {};
    },

    render: function() {
        return (
            <div>Emergency here</div>
        );
    }

});

ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'));
