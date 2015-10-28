var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Swipe = React.createClass({
    getInitialState: function() {
        return {
            error : false
        };

    },

    getDefaultProps: function() {
        return {
            handleClick : null
        };
    },

    loginFailure : function() {
        this.setState({
            student : '',
            error : true
        });
    },

    logInStudent : function() {
        if (this.state.student.length > 3) {
            $.getJSON('counseling/User/Checkin', {
            	command : 'loginStudent',
                student : this.state.student
            }).done(function(data){
                if (data.student === null) {
                    this.loginFailure();
                } else {
                    //this.setState({error:false});
                    this.props.update(data);
                }
            }.bind(this)).fail(function() {
                this.loginFailure();
            }.bind(this));
        }
    },

    componentDidUpdate : function() {
        if (this.state.error === true) {
            this.interval = setInterval(function(){
                this.resetForm();
            }.bind(this), 5000);
        }
    },

    componentWillUnmount : function() {
        clearTimeout(this.interval);
    },

    resetForm : function() {
        clearTimeout(this.interval);
        this.setState({
            error : false
        });
    },

    handleChange : function(e) {
        this.setState({
            student : e.target.value
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
            field = <input type="text" placeholder="Banner ID or ASU Email" onChange={this.handleChange} className="form-control" value={this.state.student} />;
        }


        var content = (
            <div>
                <div className="text-center">
                    <p className="title">Welcome! Please Check-in</p>
                    <p className="subtitle">Swipe your AppCard to get started</p>
                    <p>Don't have your AppCard?<br />Enter your ASU email address instead.</p>
                    {field}
                </div>
                <button className="continue pull-right btn btn-default" onClick={this.logInStudent}>Continue <i className="fa fa-chevron-right fa-sm"></i></button>
                <div className="clearfix"></div>
            </div>
        );
        return (
            <Box content={content}/>
        );
    }

});
