var Phone = React.createClass({
    mixins: [errorTimeout],

    getInitialState: function() {
        return {
            phoneNumber : '',
            error : false
        };
    },

    getDefaultProps: function() {
        return {
            update : null,
            visitor : null,
            back : null
        };
    },

    componentDidMount : function() {
        this.setState({
            phoneNumber : this.props.visitor.phone_number
        });
    },

    updatePhone : function() {
        if (this.state.phoneNumber.length < 10) {
            this.setState({error:true});
        } else {
            this.props.update(this.state.phoneNumber);
        }
    },

    handleChange : function(e) {
        this.setState({
            phoneNumber : e.target.value
        });
    },

    render: function() {
        var field = null;
        if (this.state.error) {
            field = (
                <div className="alert alert-danger alert-dismissible" role="alert" ref="errorAlert">
                    <button className="close" type="button" onClick={this.resetForm}><i className="fa fa-times"></i></button>
                    Please enter your cell phone number including your area code.
                </div>
            );
        } else {
            field = <input type="text" ref="phone" className="form-control" placeholder="Cell phone number with area code"
                value={this.state.phoneNumber} onChange={this.handleChange}/>
        }

        var content =  (
            <div>
                <div className="text-center">
                    <p className="title">Ok, {this.props.visitor.preferred_name}.</p>
                    <p className="subtitle">In case we need to reach you later,<br />
                        please enter your cell phone number.</p>
                    {field}
                    <button className="continue pull-left btn btn-default" onClick={this.props.back}><i className="fa fa-chevron-left fa-sm"> Back </i></button>
                    <button className="continue pull-right btn btn-default" onClick={this.updatePhone}>Continue <i className="fa fa-chevron-right fa-sm"></i></button>
                    <div className="clearfix"></div>
                </div>
            </div>
        );

        return (
            <Box content={content}/>
        );

    }

});
