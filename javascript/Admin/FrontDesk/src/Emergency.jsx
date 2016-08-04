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
                <EmergencyRow key={key} {...value} reload={this.props.reload}/>
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
    getDefaultProps: function() {
        return {
            visit : null,
            reload : null
        };
    },

    render: function() {
        var intakeComplete = null;

        return (
            <div className="row">
                <div className="col-sm-1">
                    <i className="fa fa-lg fa-exclamation-triangle"></i>
                </div>
                <div className="col-sm-2 visitor-name">
                    <VisitorName visitor={this.props.visitor}/>
                </div>
                <div className="col-sm-3">
                    <ClipboardInput bannerId={this.props.visitor.banner_id}/>
                </div>
                <div className="col-sm-2">
                    {this.props.wait_time} min.
                </div>
                <div className="col-sm-3">
                    <WaitingListStatus visitor={this.props.visitor} reload={this.props.reload}
                        visitNumber={this.props.total_visits}/>
                </div>
                <div className="col-sm-1">
                    <WaitingAction visitId={this.props.id} reload={this.props.reload}/>
                </div>
            </div>
        );
    }

});
