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
            visitor : null
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
    },

    updateVisitor : function(visitor) {
        this.setState({
            visitor : visitor,
        });
        this.props.updateState('reason');
    },

    render: function() {
        var content = null;
        console.log(this.props.stage);
        switch (this.props.stage) {
            case 'swipe':
                return <Swipe update={this.updateVisitor} />;
            break;

            case 'reason':
                return <Reason update={this.updateReason}/>;
            break;

            case 'phone':
                return <Phone />;
            break;

            case 'emergency':
                return <Emergency />;
            break;

            case 'message':
                return <Message />
            break;
        }
    }

});

var Box = React.createClass({
    getInitialState: function() {
        return {
        };
    },

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
