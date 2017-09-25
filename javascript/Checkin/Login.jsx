'use strict';

var resetTimeout = null;

var Login = React.createClass({
    getInitialState: function() {
        return {
            stage : 'swipe'
        };
    },

    updateStage : function(stage) {
        this.setState({
            stage : stage
        });
    },

    render: function() {
        return (
            <Stage updateStage={this.updateStage} stage={this.state.stage}/>
        );
    }

});

var Stage = React.createClass({
    getInitialState: function() {
        return {
            visitor : null,
            reason : null,
            phone : null,
            emergency : false,
            instructionList : null
        };
    },

    getDefaultProps: function() {
        return {
            stage : 'swipe'
        };
    },

    componentDidMount : function() {
        $.getJSON('counseling/User/Checkin', {
        	command : 'instructions'
        }).done(function(data){
            this.setState({
                instructionList : data
            });
        }.bind(this));

    },

    updateReason : function(reason) {
        this.setState({
            reason : reason
        });
        if (reason.ask_for_phone === '1') {
            this.props.updateStage('phone');
        } else {
            if (reason.show_emergency === '1') {
                this.props.updateStage('emergency');
            } else {
                this.props.updateStage('instruction')
            }
        }
    },

    updateVisitor : function(visitor) {
        this.setState({
            visitor : visitor,
        });
        this.props.updateStage('reason');
    },

    updatePhone : function(phone) {
        if (phone === null || phone.length === 0) {
            return;
        }
        //update phone number if changed
        if (phone !== this.state.visitor.phone_number) {
            $.post('counseling/User/Visitor', {
            	command : 'updatePhone',
                visitorId : this.state.visitor.id,
                phoneNumber : phone
            }, null, 'json')
            	.done(function(data){
            		//console.log(data);
            	}.bind(this));

        }

        this.setState({
            phone : phone
        });
        if (this.state.reason.show_emergency === '1') {
            this.props.updateStage('emergency');
        } else {
            this.props.updateStage('instruction')
        }
    },

    updateEmergency : function(emergency) {
        this.setState({
            emergency : emergency
        });
        this.props.updateStage('instruction');
    },


    componentDidUpdate : function(props, state)
    {
        if (this.props.stage === 'instruction') {
            this.completeCheckin();
        }
    },

    completeCheckin : function() {
        $.post('counseling/User/Visit', {
        	command : 'create',
            visitorId : this.state.visitor.id,
            reasonId : this.state.reason.id,
            emergency : this.state.emergency
        }, null, 'json')
        	.done(function(data){
                resetTimeout = setTimeout(this.resetLogin, 5000);
        	}.bind(this));
    },

    resetLogin : function() {
        clearTimeout(resetTimeout);
        this.props.updateStage('swipe');
        this.setState({
            visitor : null,
            reason : null,
            phone : null,
            emergency : false,
        });
    },

    backToReason : function() {
        this.setState({
            reason : null
        });
        this.props.updateStage('reason');
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
                return <Phone update={this.updatePhone} visitor={this.state.visitor} back={this.backToReason}/>;
            break;

            case 'emergency':
                return <Emergency update={this.updateEmergency}/>;
            break;

            case 'instruction':
                return <Instruction reset={this.resetLogin} instruction={this.state.reason.instruction} instructionList={this.state.instructionList}/>
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
