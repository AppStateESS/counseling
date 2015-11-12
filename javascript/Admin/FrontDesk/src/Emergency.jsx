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
                <EmergencyRow key={key} visit={value} />
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
            visit : null,
        };
    },

    render: function() {
        return (
            <div className="row">
                <div className="col-sm-1">
                    <i className="fa fa-lg fa-exclamation-triangle"></i>
                </div>
                <div className="col-sm-5 visitor-name">
                    {this.props.visit.visitor.first_name} {this.props.visit.visitor.last_name}
                </div>
                <div className="col-sm-3">
                    {this.props.visit.wait_time} min
                </div>
                <div className="col-sm-3">
                    <WaitingAction visitId={this.props.visit.id}/>
                </div>
            </div>
        );
    }

});
