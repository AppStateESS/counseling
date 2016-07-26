var TextInput = React.createClass({
    getDefaultProps: function() {
        return {
            label: '',
            placeholder: '',
            handleBlur: null,
            required: false,
            handlePress: null,
            handleChange: null,
            inputId: null,
            value: '',
            tabIndex: null
        };
    },

    handleBlur: function(e) {
        if (this.props.required && e.target.value.length < 1) {
            $(e.target).css('border-color', 'red');
        }
        if (this.props.handleBlur) {
            this.props.handleBlur(e);
        }
    },

    handleFocus: function(e) {
        $(e.target).css('border-color', '');
    },

    render: function() {
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
                {label}
                {required}
                <input
                    type="text"
                    className="form-control"
                    id={this.props.inputId}
                    name={this.props.inputId}
                    placeholder={this.props.placeholder}
                    onFocus={this.handleFocus}
                    onChange={this.props.handleChange}
                    onBlur={this.handleBlur}
                    onKeyPress={this.props.handlePress}
                    value={this.props.value}
                    tabIndex={this.props.tabIndex}/>
            </div>
        );
    },
});

var FormMixin = {
    componentDidMount: function() {
        this.loadData();
    },

    closeForm: function() {
        this.setState({showForm: false});
    },

    showForm: function() {
        this.setState({showForm: true});
    },

    saveFailure: function() {
        this.setState({saveFail: true});
    }
};

var sortable = {
    fixHelper: function(e, ui) {
        ui.children().each(function() {
            $(this).width($(this).width());
        });
        return ui;
    },

    loadSortable: function() {
        $(this.refs.sortRows).sortable({
            handle: '.handle',
            helper: this.fixHelper,
            cancel: '',
            update: this.updateSort,
            axis: 'y',
            containment: '#sortBox',
        }).disableSelection();
    },

    resortReact: function(rows, movedId, prevRowId, nextRowId) {
        var RPrev = null;
        var RMoved = null;
        var RNext = null;
        var newRows = [];
        var count = 0;
        var valId = 0;

        rows.forEach(function(value, index) {

            valId = parseInt(value.id, 10);

            if (prevRowId !== undefined && valId === prevRowId) {
                RPrev = value;
            } else if (valId === movedId) {
                RMoved = value;
            } else if (nextRowId !== undefined && valId === nextRowId) {
                RNext = value;
            }
        });

        if (RPrev === null) {
            RMoved.sorting = 1;
            count++;
            newRows.push(RMoved);
        }

        rows.forEach(function(value, index) {
            if (RMoved.id !== value.id) {
                count++;
                value.sorting = count;
                newRows.push(value);
            }
            if (RPrev !== null && RPrev.id === value.id) {
                count++;
                RMoved.sorting = count;
                newRows.push(RMoved);
            }
        });
        return newRows;
    },
};

var colorPicker = {
    pickColor: function(color, event) {
        event.preventDefault();
        this.setState({color: color});
    }
};

var PickColor = React.createClass({
    getDefaultProps: function() {
        return {handleClick: null};
    },

    render: function() {
        return (
            <div>
                <button
                    className="btn btn-default"
                    onClick={this.props.handleClick.bind(null, 'default')}>&nbsp;</button>&nbsp;
                <button
                    className="btn btn-primary"
                    onClick={this.props.handleClick.bind(null, 'primary')}>&nbsp;</button>&nbsp;
                <button
                    className="btn btn-success"
                    onClick={this.props.handleClick.bind(null, 'success')}>&nbsp;</button>&nbsp;
                <button
                    className="btn btn-info"
                    onClick={this.props.handleClick.bind(null, 'info')}>&nbsp;</button>&nbsp;
                <button
                    className="btn btn-warning"
                    onClick={this.props.handleClick.bind(null, 'warning')}>&nbsp;</button>&nbsp;
                <button
                    className="btn btn-danger"
                    onClick={this.props.handleClick.bind(null, 'danger')}>&nbsp;</button>
            </div>
        );
    },
});
