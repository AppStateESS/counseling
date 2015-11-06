var Reason = React.createClass({
    getInitialState: function() {
        return {
            reasons : null,
        };
    },

    getDefaultProps: function() {
        return {
            update: null,  // function to run upon reason selection
            visitor : null, //visitor object
            update : null // function to set parent's reason
        };
    },

    componentDidMount: function() {
        $.getJSON('counseling/User/Reason', {
        	command : 'list'
        }).done(function(data){
            if (data === null) {
                data = [];
            }
            this.setState({
                reasons : data
            })
        }.bind(this));

    },

    pickReason : function(key)
    {
        this.props.update(this.state.reasons[key]);
    },

    render: function() {
        var content;

        if (this.state.reasons === null) {
            content = 'Loading...';
        } else if (this.state.reasons.length === 0 ){
            content = <div className="alert alert-danger">System error: Please alert front desk.</div>;
        } else {
            var reasonList = this.state.reasons.map(function(value, i){
                return <li key={i} className="list-group-item pointer" onClick={this.pickReason.bind(this, i)}>{value.description}</li>;
            }.bind(this));
            content = (
                <div>
                    <div className="text-center">
                        <p className="title">Hello, {this.props.visitor.first_name}.</p>
                        <p className="title">Why are you visiting today?</p>
                    </div>
                    <ul className="list-group">
                        {reasonList}
                    </ul>
                </div>
            );
        }

        return (
            <Box content={content}/>
        );
    }

});
