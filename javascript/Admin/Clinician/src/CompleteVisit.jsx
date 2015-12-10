var CompleteVisit = React.createClass({
    getInitialState: function() {
        return {
            dispositions : []
        };
    },

    getDefaultProps: function() {
        return {
            seen : null,
            clinician : null,
        };
    },

    componentDidMount: function() {
        this.loadData();
    },

    loadData : function() {
        $.getJSON('counseling/Admin/Clinician', {
        	command : 'dispositionList'
        }).done(function(data){
            this.setState({
                dispositions : data
            });
        }.bind(this));

    },

    handleClick : function(dispositionId) {
        $.post('counseling/Admin/Clinician', {
        	command : 'assignDisposition',
            dispositionId : dispositionId,
            visitId: this.props.seen.id
        }, null, 'json')
        	.done(function(data){
                this.props.setStage('selectVisitor');
        	}.bind(this));
    },

    render: function() {

        var dispositions = null;
        var buttonClass = null;
        var icon = null;

        dispositions = this.state.dispositions.map(function(value, key){
            buttonClass = 'btn btn-lg btn-block ' + value.color;
            iconClass = 'fa fa-' + value.icon;
            return (
                <button key={key} className={buttonClass} onClick={this.handleClick.bind(null, value.id)}><i className={iconClass}></i> {value.title}</button>
            );
        }.bind(this));

        return (
            <div>
                <h2>{this.props.clinician.first_name} {this.props.clinician.last_name} meeting with {this.props.seen.first_name} {this.props.seen.last_name}</h2>
                <h3>If your consultation is complete, choose a disposition below.</h3>
                {dispositions}
                <hr />
                <div className="text-center">
                    <button className="btn btn-default btn-lg" onClick={this.props.goBack}><i className="fa fa-undo"></i> Go Back</button>
                </div>
            </div>
        );
    }

});
