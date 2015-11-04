'use strict';

var Login = React.createClass({
    getInitialState: function() {
        return {
            stage : 'swipe',
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    updateStage : function(stage) {
        this.setState({
            stage : stage
        });
    },

    render: function() {
        return (
            <Stage updateState={this.updateStage} stage={this.state.stage}/>
        );
    }

});

var Stage = React.createClass({
    getInitialState: function() {
        return {
            content : 'empty',
            visitor : null,
            reason : null,
            phone : null,
            emergency : false
        };
    },

    getDefaultProps: function() {
        return {
            stage : 'swipe'
        };
    },

    updateReason : function(reason) {
        this.setState({
            reason : reason
        });
        this.props.updateState('phone');
    },

    updateVisitor : function(visitor) {
        this.setState({
            visitor : visitor,
        });
        this.props.updateState('reason');
    },

    updatePhone : function(phone) {
        this.setState({
            phone : phone
        });
        this.props.updateState('emergency');
    },

    updateEmergency : function(emergency)
    {
        console.log(emergency);
        this.setState({
            emergency : emergency
        });
        this.props.updateState('directions');
    },

    render: function() {
        var content = null;
        switch (this.props.stage) {
            case 'swipe':
                return <Swipe update={this.updateVisitor} />;
            break;

            case 'reason':
                return <Reason update={this.updateReason} visitor={this.state.visitor}/>;
            break;

            case 'phone':
                return <Phone update={this.updatePhone} visitor={this.state.visitor}/>;
            break;

            case 'emergency':
                return <Emergency update={this.updateEmergency}/>;
            break;

            case 'directions':
                return <Directions />
            break;
        }
    }

});

var Box = React.createClass({

    getDefaultProps: function() {
        return {
            content : 'Empty'
        };
    },

    render: function() {
        return (
            <div className="checkin-box">{this.props.content}</div>
        );
    }

});


ReactDOM.render(<Login/>, document.getElementById('Login'));
