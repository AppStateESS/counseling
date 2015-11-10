var ButtonGroup = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            label : 'Action',
            options : [
                {
                label : 'Action1',
                handleClick : null,
                divider : false
                },
            ]
        };
    },

    render: function() {
        var options = this.props.options.map(function(value, key){
            return <ButtonGroupOption key={key} label={value.label} handleClick={value.handleClick} divider={value.divider} />;
        });

        return (
            <div className="btn-group">
                <button type="button" className="btn btn-default btn-sm dropdown-toggle"
                     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.label} <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {options}
                </ul>
            </div>
        );
    }
});

var ButtonGroupOption = React.createClass({
    getDefaultProps: function() {
        return {
            label : null,
            handleClick : null,
            divider : false
        };
    },

    render: function() {
        if (this.props.divider) {
            return (
                <li role="separator" className="divider"></li>
            );
        } else {
            return (
                <li onClick={this.props.handleClick}><a style={{cursor : 'pointer'}}>{this.props.label}</a></li>
            );
        }
    }

});
