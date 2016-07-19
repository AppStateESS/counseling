var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var swipeTimeout = null;

var Swipe = React.createClass({
    mixins: [errorTimeout],

    getInitialState: function() {
        return {
            error : 0,
            visitor : '',
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
            error : 1
        });
        this.timedReset();
    },

    alreadyVisiting : function() {
        this.setState({
            visitor : '',
            error : 2
        });
    },

    timedReset : function() {
        swipeTimeout = setTimeout(function(){
            this.resetSwipe();
        }.bind(this), 4000);
    },

    resetSwipe : function() {
        clearTimeout(swipeTimeout);
        this.setState({
            error : 0,
            visitor : null,
        });
    },

    logInVisitor : function() {
        var visitor = this.state.visitor;
        if (visitor && visitor.length > 3) {
            if (visitor.charAt(0) === ';' && visitor.charAt(10) === '=') {
                visitor = visitor.slice(1,10);
            }

            $.getJSON('counseling/User/Checkin', {
            	command : 'loginVisitor',
                bannerId : visitor
            })
            .done(function(data){
                if(data.waiting !== undefined) {
                    this.alreadyVisiting();
                    this.timedReset();
                } else if (data.visitor === null) {
                    this.loginFailure();
                } else {
                    this.props.update(data);
                }
            }.bind(this))
            .fail(function() {
                this.loginFailure();
            }.bind(this));
        } else {
            this.loginFailure();
        }
    },

    handleChange : function(e) {
        var character = e.target.value;
        this.setState({
            visitor : character
        });
    },

    submitVisitor : function(e)
    {
        e.preventDefault();
        this.logInVisitor();
    },

    focusSwiper : function() {
        $('#swiper').focus();
    },

    componentDidUpdate: function(prevProps, prevState) {
        this.focusSwiper();
    },

    componentDidMount: function(prevProps, prevState) {
        this.focusSwiper();
    },

    render: function() {
        var field = null;
        var button = null;

        if (this.state.error === 1) {
            field = (
                <div className="text-center">
                    <div className="alert alert-danger alert-dismissible" role="alert" ref="errorAlert">
                        Account not found. Please try again or see the front desk.
                    </div>
                    <button className="btn btn-default" type="button" onClick={this.resetSwipe}><i className="fa fa-repeat"></i> Try again</button>
                </div>
            );
        } else if (this.state.error === 2) {
            field = (
                <div className="alert alert-warning alert-dismissible" role="alert" ref="errorAlert">
                    <button className="close" type="button" onClick={this.resetSwipe}><i className="fa fa-times"></i></button>
                    You are already logged in. Please visit the front desk if you have a question or concern.
                </div>
            );
        } else {
            field = <input id="swiper" type="text" placeholder="Banner ID" onChange={this.handleChange}
                 className="form-control" value={this.state.visitor} />;
            button = <button className="continue pull-right btn btn-default" onClick={this.logInVisitor}>Continue <i className="fa fa-chevron-right fa-sm"></i></button>;
        }

        var content = (
            <div>
                <div className="text-center">
                    <p className="title">Welcome! Please Check-in</p>
                    <p className="subtitle">Swipe your AppCard to get started</p>
                    <p>Don't have your AppCard?<br />Enter your Banner ID number instead.</p>
                    <form onSubmit={this.submitVisitor}>
                    {field}
                    </form>
                </div>
                {button}
                <div className="clearfix"></div>
            </div>
        );
        return (
            <Box content={content}/>
        );
    }

});
