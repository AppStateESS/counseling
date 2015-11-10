var Emergency = React.createClass({
    mixins : ['ButtonGroup'],

    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            list : null
        };
    },

    render: function() {
        if (this.props.list === null) {
            return null;
        }

        var rows = this.props.list.map(function(value, key){
            return (
                <EmergencyRow key={key} visitor={value.visitor} waiting={value.waiting} />
            );
        }.bind(this));

        return (
            <div className="emergency">
                {rows}
            </div>
        );
    }

});

var EmergencyRow = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            visitor : null,
            waiting : 0
        };
    },

    render: function() {
        return (
            <div className="row">
                <div className="col-sm-1">
                    <i className="fa fa-lg fa-exclamation-triangle"></i>
                </div>
                <div className="col-sm-5 visitor-name">
                    {this.props.visitor}
                </div>
                <div className="col-sm-3">
                    {this.props.waiting} min
                </div>
                <div className="col-sm-3">
                    <WaitingAction />
                </div>
            </div>
        );
    }

});
