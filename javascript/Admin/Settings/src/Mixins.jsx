var TextInput = React.createClass({
    getDefaultProps: function() {
        return {
            label: '',
            placeholder: '',
            handleBlur:null,
            required: false,
            handlePress : null,
            handleChange : null,
            inputId : null,
            defaultValue : null,
            tabIndex : null
        };
    },

    handleBlur : function(e) {
        if (this.props.required && e.target.value.length < 1) {
            $(e.target).css('border-color', 'red');
        }
        if (this.props.handleBlur) {
            this.props.handleBlur(e);
        }
    },

    handleFocus : function(e) {
        $(e.target).css('border-color', '');
    },

    render : function() {
        var label = '';
        var required = '';
        if (this.props.label.length > 0) {
            if (this.props.required) {
                required = <i className="fa fa-asterisk text-danger"></i>;
            }
            label = <label htmlFor={this.props.inputId}>{this.props.label}</label>;
        } else {
            label = null;
        }
        return (
            <div className="form-group">
                {label} {required}
                <input type="text" className="form-control" id={this.props.inputId}
                    name={this.props.inputId} placeholder={this.props.placeholder} onFocus={this.handleFocus}
                    onChange={this.props.handleChange} onBlur={this.handleBlur} onKeyPress={this.props.handlePress} defaultValue={this.props.defaultValue} tabIndex={this.props.tabIndex}/>
            </div>
        );
    }
});
