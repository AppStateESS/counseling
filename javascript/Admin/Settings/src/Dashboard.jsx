var SettingsDashboard = React.createClass({
    getInitialState: function() {
        return {
            tab : 'Reasons'
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    selectTab : function(tab) {
        this.setState({tab:tab});
    },

    render: function() {
        return (
            <div>
                <h2>Counseling Check-In Settings</h2>
                <ul className="nav nav-tabs">
                    <Tab active={this.state.tab == 'Reasons'} label={'Reasons'} handleClick={this.selectTab.bind(this, 'Reasons')}/>
                    <Tab active={this.state.tab == 'Visitors'} label={'Visitors'}  handleClick={this.selectTab.bind(this, 'Visitors')}/>
                    <Tab active={this.state.tab == 'Visits'} label={'Visits'}  handleClick={this.selectTab.bind(this, 'Visits')}/>
                    <Tab active={this.state.tab == 'Dispositions'} label={'Dispositions'} handleClick={this.selectTab.bind(this, 'Dispositions')}/>
                </ul>
                <div style={{marginTop:'1em'}}>
                    <Content tab={this.state.tab} />
                </div>
            </div>
        );
    }

});

var Tab = React.createClass({
    getDefaultProps: function() {
        return {
            active : false,
            label : null
        };
    },

    render: function() {
        return (
            <li role="presentation" onClick={this.props.handleClick} className={this.props.active ? 'active' : null}>
                <a className="pointer">{this.props.label}</a>
            </li>
        );
    }

});

var Content = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            tab : null
        };
    },

    render: function() {
        var content = null;
        switch (this.props.tab) {
            case 'Reasons':
            content = <Reasons />
            break;

            case 'Visitors':
            content = <Visitors />
            break;

            case 'Visits':
            content = <Visits />
            break;

            case 'Dispositions':
            content = <Dispositions />
            break;
        }

        return (
            <div>{content}</div>
        );
    }

});

var BoolIcon = React.createClass({
    getDefaultProps: function() {
        return {
            bool : true,
            handleClick : null
        };
    },

    render: function() {
        var _className = this.props.bool === '1' ? 'fa fa-thumbs-o-up text-success' : 'fa fa-thumbs-o-down text-danger';

        if (this.props.handleClick !== null) {
            _className += ' pointer';
        }

        return (
            <i className={_className} onClick={this.props.handleClick}></i>
        );
    }
});


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
            defaultValue : null
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
                    onChange={this.props.handleChange} onBlur={this.handleBlur} onKeyPress={this.props.handlePress} defaultValue={this.props.defaultValue}/>
            </div>
        );
    }
});

ReactDOM.render(<SettingsDashboard/>, document.getElementById('settings-dashboard'));
