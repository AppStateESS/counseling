var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Swipe = React.createClass({
    mixins: [errorTimeout],

    getInitialState: function() {
        return {
            error : false,
            visitor : null
        };

    },

    getDefaultProps: function() {
        return {
            handleClick : null
        };
    },

    loginFailure : function() {
        this.setState({
            visitor : '',
            error : true
        });
    },

    logInVisitor : function() {
        if (this.state.visitor.length > 3) {
            $.getJSON('counseling/User/Checkin', {
            	command : 'loginVisitor',
                bannerId : this.state.visitor
            }).done(function(data){
                if (data.visitor === null) {
                    this.loginFailure();
                } else {
                    this.props.update(data);
                }
            }.bind(this)).fail(function() {
                this.loginFailure();
            }.bind(this));
        } else {
            this.loginFailure();
        }
    },

    handleChange : function(e) {
        this.setState({
            visitor : e.target.value
        });
    },

    render: function() {
        var field = null;

        if (this.state.error) {
            field = (
                <div className="alert alert-danger alert-dismissible" role="alert" ref="errorAlert">
                    <button className="close" type="button" onClick={this.resetForm}><i className="fa fa-times"></i></button>
                    Account not found. Please try again or see the front desk.
                </div>
            );
        } else {
            field = <input type="text" placeholder="Banner ID or ASU Email" onChange={this.handleChange} className="form-control" value={this.state.visitor} />;
        }


        var content = (
            <div>
                <div className="text-center">
                    <p className="title">Welcome! Please Check-in</p>
                    <p className="subtitle">Swipe your AppCard to get started</p>
                    <p>Don't have your AppCard?<br />Enter your Banner ID number instead.</p>
                    {field}
                </div>
                <button className="continue pull-right btn btn-default" onClick={this.logInVisitor}>Continue <i className="fa fa-chevron-right fa-sm"></i></button>
                <div className="clearfix"></div>
            </div>
        );
        return (
            <Box content={content}/>
        );
    }

});
