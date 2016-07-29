'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var TextInput = React.createClass({
    displayName: 'TextInput',

    getDefaultProps: function getDefaultProps() {
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

    handleBlur: function handleBlur(e) {
        if (this.props.required && e.target.value.length < 1) {
            $(e.target).css('border-color', 'red');
        }
        if (this.props.handleBlur) {
            this.props.handleBlur(e);
        }
    },

    handleFocus: function handleFocus(e) {
        $(e.target).css('border-color', '');
    },

    render: function render() {
        var label = '';
        var required = '';
        if (this.props.label.length > 0) {
            if (this.props.required) {
                required = React.createElement('i', { className: 'fa fa-asterisk text-danger' });
            }
            label = React.createElement(
                'label',
                { htmlFor: this.props.inputId },
                this.props.label
            );
        } else {
            label = null;
        }
        return React.createElement(
            'div',
            { className: 'form-group' },
            label,
            required,
            React.createElement('input', {
                type: 'text',
                className: 'form-control',
                id: this.props.inputId,
                name: this.props.inputId,
                placeholder: this.props.placeholder,
                onFocus: this.handleFocus,
                onChange: this.props.handleChange,
                onBlur: this.handleBlur,
                onKeyPress: this.props.handlePress,
                value: this.props.value,
                tabIndex: this.props.tabIndex })
        );
    }
});

var FormMixin = {
    componentDidMount: function componentDidMount() {
        this.loadData();
    },

    closeForm: function closeForm() {
        this.setState({ showForm: false });
    },

    showForm: function showForm() {
        this.setState({ showForm: true });
    },

    saveFailure: function saveFailure() {
        this.setState({ saveFail: true });
    }
};

var sortable = {
    fixHelper: function fixHelper(e, ui) {
        ui.children().each(function () {
            $(this).width($(this).width());
        });
        return ui;
    },

    loadSortable: function loadSortable() {
        $(this.refs.sortRows).sortable({
            handle: '.handle',
            helper: this.fixHelper,
            cancel: '',
            update: this.updateSort,
            axis: 'y',
            containment: '#sortBox'
        }).disableSelection();
    },

    resortReact: function resortReact(rows, movedId, prevRowId, nextRowId) {
        var RPrev = null;
        var RMoved = null;
        var RNext = null;
        var newRows = [];
        var count = 0;
        var valId = 0;

        rows.forEach(function (value, index) {

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

        rows.forEach(function (value, index) {
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
    }
};

var colorPicker = {
    pickColor: function pickColor(color, event) {
        event.preventDefault();
        this.setState({ color: color });
    }
};

var PickColor = React.createClass({
    displayName: 'PickColor',

    getDefaultProps: function getDefaultProps() {
        return { handleClick: null };
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'button',
                {
                    className: 'btn btn-default',
                    onClick: this.props.handleClick.bind(null, 'default') },
                ' '
            ),
            ' ',
            React.createElement(
                'button',
                {
                    className: 'btn btn-primary',
                    onClick: this.props.handleClick.bind(null, 'primary') },
                ' '
            ),
            ' ',
            React.createElement(
                'button',
                {
                    className: 'btn btn-success',
                    onClick: this.props.handleClick.bind(null, 'success') },
                ' '
            ),
            ' ',
            React.createElement(
                'button',
                {
                    className: 'btn btn-info',
                    onClick: this.props.handleClick.bind(null, 'info') },
                ' '
            ),
            ' ',
            React.createElement(
                'button',
                {
                    className: 'btn btn-warning',
                    onClick: this.props.handleClick.bind(null, 'warning') },
                ' '
            ),
            ' ',
            React.createElement(
                'button',
                {
                    className: 'btn btn-danger',
                    onClick: this.props.handleClick.bind(null, 'danger') },
                ' '
            )
        );
    }
});

var Reasons = React.createClass({
    displayName: 'Reasons',

    mixins: [FormMixin],

    getInitialState: function getInitialState() {
        return { showForm: false, reasons: null, saveFail: false, currentEdit: null };
    },

    loadData: function loadData() {
        $.getJSON('counseling/Admin/Settings/Reason', { command: 'list' }).done(function (data) {
            this.setState({ reasons: data });
        }.bind(this));
    },

    setCurrentEdit: function setCurrentEdit(reasonId, section) {
        var currentEdit = null;
        if (reasonId !== null) {
            currentEdit = {
                id: reasonId,
                section: section
            };
        }
        this.setState({ currentEdit: currentEdit });
    },

    render: function render() {
        var form = null;
        var button = null;
        var alert = null;
        var reasons = null;

        if (this.state.showForm) {
            form = React.createElement(ReasonForm, {
                closeForm: this.closeForm,
                reload: this.loadData,
                fail: this.saveFailure });
        } else {
            button = React.createElement(
                'button',
                {
                    className: 'btn btn-success',
                    onClick: this.showForm,
                    style: {
                        marginBottom: '1em'
                    } },
                'Add reason',
                React.createElement('i', { className: 'fa fa-caret-down' })
            );
        }
        if (this.state.saveFail) {
            alert = React.createElement(
                'div',
                { className: 'alert alert-danger' },
                React.createElement(
                    'strong',
                    null,
                    React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                    'Error:'
                ),
                'Reason save failed'
            );
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'settings-form-area' },
                React.createElement(
                    'div',
                    {
                        style: {
                            position: 'relative'
                        } },
                    form
                ),
                button
            ),
            alert,
            React.createElement(
                'div',
                { className: 'settings-listing' },
                React.createElement(ReasonList, {
                    reasons: this.state.reasons,
                    reload: this.loadData,
                    currentEdit: this.state.currentEdit,
                    setCurrentEdit: this.setCurrentEdit })
            )
        );
    }
});

var ReasonList = React.createClass({
    displayName: 'ReasonList',

    getDefaultProps: function getDefaultProps() {
        return {
            reasons: null,
            reload: null,
            currentEdit: 0,
            setCurrentEdit: null
        };
    },

    render: function render() {
        var reasons = null;
        if (this.props.reasons) {
            reasons = this.props.reasons.map(function (value, key) {
                return React.createElement(ReasonRow, _extends({ key: key }, value, { reload: this.props.reload,
                    currentEdit: this.props.currentEdit,
                    setCurrentEdit: this.props.setCurrentEdit }));
            }.bind(this));
        }
        return React.createElement(
            'div',
            null,
            reasons
        );
    }
});

var ReasonRow = React.createClass({
    displayName: 'ReasonRow',

    getInitialState: function getInitialState() {
        return {
            id: 0,
            title: '',
            description: '',
            instruction: '',
            show_emergency: true,
            category: 0,
            wait_listed: false,
            ask_for_phone: false,
            active: true,
            sorting: 0,
            color: 'default'
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            id: 0,
            title: '',
            description: '',
            instruction: '',
            show_emergency: true,
            category: 0,
            wait_listed: false,
            ask_for_phone: false,
            active: true,
            sorting: 0,
            color: 'default',
            reload: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.setState(this.props);
    },

    flipEmergency: function flipEmergency() {
        $.post('counseling/Admin/Settings/Reason', {
            command: 'flipEmergency',
            reasonId: this.state.id
        }, null, 'json').done(function (data) {
            var switcher = this.state.show_emergency == '1' ? '0' : '1';
            this.setState({ show_emergency: switcher });
        }.bind(this));
    },

    flipWaitListed: function flipWaitListed() {
        $.post('counseling/Admin/Settings/Reason', {
            command: 'flipWaitListed',
            reasonId: this.state.id
        }, null, 'json').done(function (data) {
            var switcher = this.state.wait_listed == '1' ? '0' : '1';
            this.setState({ wait_listed: switcher });
        }.bind(this));
    },

    flipAskForPhone: function flipAskForPhone() {
        $.post('counseling/Admin/Settings/Reason', {
            command: 'flipAskForPhone',
            reasonId: this.state.id
        }, null, 'json').done(function (data) {
            var switcher = this.state.ask_for_phone == '1' ? '0' : '1';
            this.setState({ ask_for_phone: switcher });
        }.bind(this));
    },

    pickColor: function pickColor(value) {
        this.setState({ color: value });
        $.post('counseling/Admin/Settings/Reason', {
            command: 'pickColor',
            reasonId: this.state.id,
            color: value
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    deleteReason: function deleteReason(reason) {
        $.post('counseling/Admin/Settings/Reason', {
            command: 'delete',
            reasonId: this.state.id
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    updateTitle: function updateTitle(event) {
        this.setState({ title: event.target.value });
    },

    updateDescription: function updateDescription(event) {
        this.setState({ description: event.target.value });
    },

    updateInstruction: function updateInstruction(event) {
        this.setState({ instruction: event.target.value });
    },

    updateCategory: function updateCategory(event) {
        this.setState({ category: event.target.value });
    },

    resetTitle: function resetTitle() {
        this.setState({ title: this.props.title });
    },

    resetDescription: function resetDescription() {
        this.setState({ description: this.props.description });
    },

    resetInstruction: function resetInstruction() {
        this.setState({ instruction: this.props.instruction });
    },

    resetCategory: function resetCategory() {
        this.setState({ category: this.props.category });
    },

    saveTitle: function saveTitle() {
        if (this.state.title === null || this.state.title.length === 0) {
            return;
        }
        $.post('counseling/Admin/Settings/Reason', {
            command: 'setTitle',
            reasonId: this.state.id,
            title: this.state.title
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    saveDescription: function saveDescription() {
        if (this.state.description === null || this.state.description.length === 0) {
            return;
        }
        $.post('counseling/Admin/Settings/Reason', {
            command: 'setDescription',
            reasonId: this.state.id,
            description: this.state.description
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    saveInstruction: function saveInstruction() {
        if (this.state.instruction === null || this.state.instruction.length === 0) {
            return;
        }
        $.post('counseling/Admin/Settings/Reason', {
            command: 'setInstruction',
            reasonId: this.state.id,
            instruction: this.state.instruction
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    saveCategory: function saveCategory() {
        if (this.state.category === null || this.state.category.length === 0) {
            return;
        }
        $.post('counseling/Admin/Settings/Reason', {
            command: 'setCategory',
            reasonId: this.state.id,
            category: this.state.category
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    render: function render() {
        var deleteButton = null;
        if (settingsAllowed) {
            deleteButton = React.createElement(
                'button',
                {
                    className: 'pull-right btn btn-danger btn-sm',
                    onClick: this.deleteReason },
                React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                'Delete'
            );
        }

        var emergency = React.createElement(FlipOption, {
            handleClick: this.flipEmergency,
            active: this.state.show_emergency == '1',
            title: 'Reason ask visitor if they have an emergency',
            label: 'Ask emergency',
            icon: 'fa-exclamation-triangle' });

        var wait = React.createElement(FlipOption, {
            handleClick: this.flipWaitListed,
            active: this.state.wait_listed == '1',
            title: 'Choosing this reason puts visitor in the wait queue',
            label: 'Wait list',
            icon: 'fa-hourglass-start' });

        var phone = React.createElement(FlipOption, {
            handleClick: this.flipAskForPhone,
            active: this.state.ask_for_phone == '1',
            title: 'Choosing this asks for the visitor\'s phone number',
            label: 'Phone number',
            icon: 'fa-phone' });

        var panelClass = 'panel panel-' + this.state.color;
        var props = {
            reasonId: this.state.id,
            reload: this.props.reload,
            currentEdit: this.props.currentEdit,
            setCurrentEdit: this.props.setCurrentEdit
        };

        return React.createElement(
            'div',
            { className: panelClass },
            React.createElement(
                'div',
                { className: 'panel-heading' },
                React.createElement(
                    'span',
                    { className: 'badge' },
                    this.state.ordering
                ),
                deleteButton,
                React.createElement('div', { className: 'clearfix' })
            ),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(
                            'div',
                            { className: 'section' },
                            React.createElement(
                                'strong',
                                null,
                                'Title:'
                            ),
                            React.createElement(ReasonTitle, _extends({ value: this.state.title, reset: this.resetTitle,
                                update: this.updateTitle, save: this.saveTitle }, props))
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(
                            'div',
                            { className: 'section' },
                            React.createElement(
                                'strong',
                                null,
                                'Description:'
                            ),
                            React.createElement(ReasonDescription, _extends({ value: this.state.description,
                                reset: this.resetDescription, update: this.updateDescription,
                                save: this.saveDescription }, props))
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(
                            'div',
                            { className: 'section' },
                            React.createElement(
                                'strong',
                                null,
                                'Instruction:'
                            ),
                            React.createElement(ReasonInstruction, _extends({ value: this.state.instruction,
                                reset: this.resetInstruction, update: this.updateInstruction,
                                save: this.saveInstruction }, props))
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(
                            'div',
                            { className: 'section' },
                            React.createElement(
                                'strong',
                                null,
                                'Category:'
                            ),
                            React.createElement(ReasonCategory, _extends({ value: this.state.category, reset: this.resetCategory,
                                update: this.updateCategory, save: this.saveCategory }, props))
                        )
                    )
                ),
                React.createElement('hr', null),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-12' },
                        React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'strong',
                                null,
                                'Reason highlight'
                            )
                        ),
                        React.createElement(PickColor, { handleClick: this.pickColor })
                    )
                ),
                React.createElement('hr', null),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-4 text-center' },
                        wait
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-4 text-center' },
                        emergency
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-4 text-center' },
                        phone
                    )
                )
            )
        );
    }
});

var ReasonTitle = React.createClass({
    displayName: 'ReasonTitle',


    getDefaultProps: function getDefaultProps() {
        return {
            value: '',
            reasonId: 0,
            reload: null,
            currentEdit: null,
            setCurrentEdit: null,
            update: null,
            save: null,
            reset: null
        };
    },

    render: function render() {
        return React.createElement(ReasonValue, _extends({}, this.props, {
            placeholder: 'One or two words describing reason. Internal use only.',
            section: '1' }));
    }
});

var ReasonCategory = React.createClass({
    displayName: 'ReasonCategory',

    getInitialState: function getInitialState() {
        return { editMode: false };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            value: '1',
            editMode: false,
            reasonId: 0,
            reset: null,
            update: null,
            save: null,
            reload: null,
            currentEdit: null,
            setCurrentEdit: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.setState({ editMode: this.props.editMode });
    },

    componentDidUpdate: function componentDidUpdate() {
        $('.editItem').focus();
    },

    formMode: function formMode() {
        this.props.setCurrentEdit(this.props.reasonId, 4);
        this.setState({ editMode: true });
    },

    closeForm: function closeForm() {
        this.setState({ editMode: false });
        this.props.reset();
    },

    save: function save() {
        this.setState({ editMode: false });
        this.props.save();
    },

    render: function render() {
        var value = null;
        var matchOption = null;

        switch (this.props.value) {
            case '0':
                matchOption = 'Other';
                break;

            case '1':
                matchOption = 'Walk-in';
                break;

            case '2':
                matchOption = 'Appointment';
                break;
        }

        var selectOptions = [{
            value: '0',
            label: 'Other'
        }, {
            value: '1',
            label: 'Walk-in'
        }, {
            value: '2',
            label: 'Appointment'
        }];

        if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == '4') {
            value = React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-8' },
                    React.createElement(ReasonSelect, {
                        options: selectOptions,
                        match: this.props.value,
                        handleChange: this.props.update })
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-4' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-success', onClick: this.save },
                        React.createElement('i', { className: 'fa fa-check' })
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-danger', onClick: this.closeForm },
                        React.createElement('i', { className: 'fa fa-times' })
                    )
                )
            );
        } else {
            value = React.createElement(
                'div',
                {
                    style: {
                        cursor: 'pointer'
                    },
                    onClick: this.formMode,
                    className: 'col-sm-8 editItem',
                    title: 'Click to edit' },
                matchOption
            );
        }

        return React.createElement(
            'div',
            null,
            value
        );
    }
});

var ReasonInstruction = React.createClass({
    displayName: 'ReasonInstruction',

    getInitialState: function getInitialState() {
        return { editMode: false };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            value: '1',
            editMode: false,
            reasonId: 0,
            reset: null,
            update: null,
            save: null,
            reload: null,
            currentEdit: null,
            setCurrentEdit: null
        };
    },

    componentDidUpdate: function componentDidUpdate() {
        $('.editItem').focus();
    },

    componentDidMount: function componentDidMount() {
        this.setState({ editMode: this.props.editMode });
    },

    formMode: function formMode() {
        this.props.setCurrentEdit(this.props.reasonId, 3);
        this.setState({ editMode: true });
    },

    closeForm: function closeForm() {
        this.setState({ editMode: false });
        this.props.reset();
    },

    save: function save() {
        this.setState({ editMode: false });
        this.props.save();
    },

    render: function render() {
        var value = null;
        var matchOption = null;
        if (this.props.value === '1') {
            matchOption = 'Sit down';
        } else {
            matchOption = 'See the front desk';
        }

        var selectOptions = [{
            value: '1',
            label: 'Sit down'
        }, {
            value: '2',
            label: 'See front desk'
        }];

        if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == '3') {
            value = React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-8' },
                    React.createElement(ReasonSelect, {
                        options: selectOptions,
                        match: this.props.value,
                        handleChange: this.props.update })
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-4' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-success', onClick: this.save },
                        React.createElement('i', { className: 'fa fa-check' })
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-danger', onClick: this.closeForm },
                        React.createElement('i', { className: 'fa fa-times' })
                    )
                )
            );
        } else {
            value = React.createElement(
                'div',
                { style: { cursor: 'pointer' },
                    onClick: this.formMode,
                    className: 'col-sm-8 editItem',
                    title: 'Click to edit' },
                matchOption
            );
        }

        return React.createElement(
            'div',
            null,
            value
        );
    }
});

var ReasonSelect = React.createClass({
    displayName: 'ReasonSelect',

    getDefaultProps: function getDefaultProps() {
        return {
            match: '0',
            handleChange: null,
            options: null
        };
    },

    render: function render() {
        return React.createElement(
            'select',
            {
                defaultValue: this.props.match,
                className: 'form-control',
                onChange: this.props.handleChange },
            this.props.options.map(function (value, key) {
                return React.createElement(
                    'option',
                    { key: key, value: value.value },
                    value.label
                );
            }.bind(this))
        );
    }
});

var ReasonDescription = React.createClass({
    displayName: 'ReasonDescription',


    getDefaultProps: function getDefaultProps() {
        return {
            value: null,
            reasonId: 0,
            reload: null,
            currentEdit: null,
            setCurrentEdit: null,
            update: null,
            save: null,
            reset: null
        };
    },

    render: function render() {
        return React.createElement(ReasonValue, _extends({}, this.props, {
            placeholder: 'Description of reason. Seen by visitors.', section: '2' }));
    }
});

var ReasonValue = React.createClass({
    displayName: 'ReasonValue',

    getInitialState: function getInitialState() {
        return { editMode: false };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            value: '',
            reasonId: 0,
            reload: null,
            currentEdit: null,
            setCurrentEdit: null,
            update: null,
            save: null,
            placeholder: null,
            section: 0,
            reset: null
        };
    },

    closeInput: function closeInput() {
        this.setState({ editMode: false });
        this.props.reset();
    },

    componentDidUpdate: function componentDidUpdate() {
        $('.editItem').focus();
    },

    openInput: function openInput() {
        this.props.setCurrentEdit(this.props.reasonId, this.props.section);
        this.setState({ editMode: true });
    },

    save: function save() {
        this.setState({ editMode: false });
        this.props.save();
    },

    render: function render() {
        var value = null;
        if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == this.props.section) {
            value = React.createElement(LineEdit, { placeholder: this.props.placeholder,
                update: this.props.update, value: this.props.value,
                close: this.closeInput, save: this.save });
        } else {
            value = React.createElement(
                'div',
                { className: 'editItem', onClick: this.openInput, title: 'Click to edit' },
                this.props.value
            );
        }

        return React.createElement(
            'div',
            null,
            value
        );
    }
});

var LineEdit = React.createClass({
    displayName: 'LineEdit',

    getDefaultProps: function getDefaultProps() {
        return {
            placeholder: null,
            defaultValue: null,
            close: null,
            update: null,
            save: null,
            value: ''
        };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'input-group' },
            React.createElement('input', { type: 'text',
                className: 'editItem form-control',
                placeholder: this.props.placeholder,
                onChange: this.props.update,
                value: this.props.value }),
            React.createElement(
                'span',
                { className: 'input-group-btn' },
                React.createElement(
                    'button',
                    { className: 'btn btn-success', onClick: this.props.save },
                    React.createElement('i', { className: 'fa fa-check' })
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-danger', onClick: this.props.close },
                    React.createElement('i', { className: 'fa fa-times' })
                )
            )
        );
    }
});

var FlipOption = React.createClass({
    displayName: 'FlipOption',

    getDefaultProps: function getDefaultProps() {
        return {
            handleClick: null,
            active: false,
            title: null,
            label: null,
            icon: null
        };
    },

    render: function render() {
        var divClass = null;
        var iconClass = 'fa fa-lg ' + this.props.icon;

        if (this.props.active) {
            divClass = 'text-success';
        } else {
            divClass = 'dim';
        }
        return React.createElement(
            'div',
            {
                onClick: this.props.handleClick,
                className: divClass,
                style: {
                    cursor: 'pointer'
                } },
            React.createElement('i', { className: iconClass, title: this.props.title }),
            this.props.label
        );
    }
});

var ReasonForm = React.createClass({
    displayName: 'ReasonForm',

    getInitialState: function getInitialState() {
        return {
            title: '',
            description: '',
            instruction: 1,
            category: 1,
            showEmergency: false,
            askForPhone: 0,
            waitListed: true,
            formError: false,
            instructionList: null
        };
    },

    getDefaultProps: function getDefaultProps() {
        return { closeForm: null, reload: null, fail: null };
    },

    componentDidMount: function componentDidMount() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    },

    save: function save(event) {
        event.preventDefault();
        if (this.state.title === null || this.state.title.length === 0) {
            $('#title').css('borderColor', 'red');
            this.setState({ formError: true });
            return;
        }

        if (this.state.description === null || this.state.description.length === 0) {
            $('#description').css('borderColor', 'red');
            this.setState({ formError: true });
            return;
        }

        this.setState({ formError: false });
        $.post('counseling/Admin/Settings/Reason', {
            command: 'save',
            reasonId: 0,
            title: this.state.title,
            description: this.state.description,
            instruction: this.state.instruction,
            category: this.state.category,
            showEmergency: this.state.showEmergency,
            askForPhone: this.state.askForPhone,
            waitListed: this.state.waitListed
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this)).fail(function () {
            this.props.fail();
        }.bind(this)).always(function () {
            this.props.closeForm();
        }.bind(this));
    },

    updateTitle: function updateTitle(event) {
        this.setState({ title: event.target.value });
    },

    updateDescription: function updateDescription(event) {
        this.setState({ description: event.target.value });
    },

    updateInstruction: function updateInstruction(event) {
        this.setState({ instruction: event.target.value });
    },

    updateCategory: function updateCategory(event) {
        this.setState({ category: event.target.value });
    },

    updateEmergency: function updateEmergency(event) {
        var showEmergency = event.target.checked;
        var waitListed = this.state.waitListed;

        if (showEmergency) {
            waitListed = true;
        }

        this.setState({ waitListed: waitListed, showEmergency: showEmergency });
    },

    updateAskForPhone: function updateAskForPhone(event) {
        this.setState({ askForPhone: event.target.checked });
    },

    updateWaitListed: function updateWaitListed(event) {
        var waitListed = event.target.checked;
        var showEmergency = this.state.showEmergency;

        if (!waitListed) {
            showEmergency = false;
        }

        this.setState({ waitListed: waitListed, showEmergency: showEmergency });
    },

    closeForm: function closeForm(event) {
        event.preventDefault();
        this.props.closeForm();
    },

    render: function render() {
        return React.createElement(
            'div',
            {
                style: {
                    position: 'absolute',
                    width: '600px',
                    backgroundColor: 'white',
                    border: '1px solid black',
                    padding: '1em',
                    borderRadius: '10px',
                    zIndex: '50'
                } },
            React.createElement(
                'form',
                { method: 'post', action: 'counseling/Admin/Settings/Reasons' },
                React.createElement('input', { type: 'hidden', name: 'command', value: 'add' }),
                this.state.formError ? React.createElement(
                    'div',
                    { className: 'alert alert-danger', style: { fontSize: '1em' } },
                    'Please complete all highlighted text inputs.'
                ) : null,
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(TextInput, {
                        inputId: 'title',
                        label: 'Title',
                        placeholder: 'One or two words describing reason. Internal use only.',
                        handleChange: this.updateTitle,
                        required: true,
                        tabIndex: 1,
                        value: this.state.title })
                ),
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(TextInput, {
                        inputId: 'description',
                        label: 'Description',
                        placeholder: 'Description of reason. Seen by visitors.',
                        handleChange: this.updateDescription,
                        required: true,
                        tabIndex: 2,
                        value: this.state.description })
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                null,
                                'Instructions'
                            ),
                            React.createElement(
                                'p',
                                null,
                                React.createElement(
                                    'label',
                                    { style: { marginRight: '2em' } },
                                    React.createElement('input', { type: 'radio', name: 'instruction',
                                        defaultValue: '1', defaultChecked: true,
                                        tabIndex: 3, onClick: this.updateInstruction }),
                                    ' ',
                                    'Sit down'
                                ),
                                React.createElement(
                                    'label',
                                    null,
                                    React.createElement('input', {
                                        type: 'radio',
                                        name: 'instruction',
                                        defaultValue: '2',
                                        tabIndex: 4,
                                        onClick: this.updateInstruction }),
                                    ' ',
                                    'Front desk'
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                null,
                                React.createElement('input', { type: 'checkbox', name: 'waitListed', value: '1',
                                    checked: this.state.waitListed,
                                    onChange: this.updateWaitListed, tabIndex: 7 }),
                                ' ',
                                'Put on wait list',
                                ' ',
                                React.createElement('i', { className: 'fa fa-question-circle', style: { cursor: 'pointer' },
                                    'data-toggle': 'tooltip', 'data-placement': 'right',
                                    title: 'If checked, the visitor will be placed on the waiting list.' })
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                null,
                                React.createElement('input', { type: 'checkbox', name: 'showEmergency', value: '1',
                                    checked: this.state.showEmergency, onChange: this.updateEmergency,
                                    tabIndex: 5 }),
                                ' Show emergency question',
                                ' ',
                                React.createElement('i', { className: 'fa fa-question-circle', style: { cursor: 'pointer' },
                                    'data-toggle': 'tooltip', 'data-placement': 'right',
                                    title: 'If checked, the visitor will be asked if they have an emergency.' })
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                null,
                                React.createElement('input', {
                                    type: 'checkbox',
                                    name: 'askForPhone',
                                    value: '1',
                                    checked: this.state.askForPhone,
                                    onChange: this.updateAskForPhone,
                                    tabIndex: 8 }),
                                ' ',
                                'Ask for phone number  ',
                                React.createElement('i', { className: 'fa fa-question-circle', style: { cursor: 'pointer' },
                                    'data-toggle': 'tooltip', 'data-placement': 'right',
                                    title: 'If checked, the visitor will be asked for their phone number.' })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(GroupSelect, null)
                    )
                ),
                React.createElement(
                    'button',
                    { className: 'pull-left btn btn-primary', onClick: this.save, tabIndex: 8 },
                    React.createElement('i', { className: 'fa fa-check' }),
                    'Save reason'
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-danger', onClick: this.closeForm, tabIndex: 9 },
                    React.createElement('i', { className: 'fa fa-times' }),
                    'Cancel'
                )
            )
        );
    }
});

var GroupSelect = React.createClass({
    displayName: 'GroupSelect',


    getDefaultProps: function getDefaultProps() {
        return {};
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'label',
                null,
                'Category'
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    React.createElement('input', { type: 'radio', name: 'summaryGroup', defaultValue: '1',
                        onClick: this.updateCategory }),
                    ' ',
                    React.createElement('i', { className: 'fa fa-male fa-lg' }),
                    ' ',
                    'Walk-in'
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    React.createElement('input', { type: 'radio', name: 'summaryGroup', defaultValue: '2',
                        onClick: this.updateCategory }),
                    ' ',
                    React.createElement('i', { className: 'fa fa-clock-o fa-lg' }),
                    ' ',
                    'Appointment'
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    React.createElement('input', {
                        type: 'radio',
                        name: 'summaryGroup',
                        defaultChecked: true,
                        defaultValue: '0',
                        onClick: this.updateCategory }),
                    ' ',
                    React.createElement('i', { className: 'fa fa-question-circle fa-lg' }),
                    ' ',
                    'Other'
                )
            )
        );
    }
});

var Dispositions = React.createClass({
    displayName: 'Dispositions',

    mixins: [FormMixin],

    getInitialState: function getInitialState() {
        return {
            dispositions: null,
            saveFail: false,
            currentEdit: null,
            showForm: false,
            currentDisposition: null
        };
    },

    loadData: function loadData() {
        $.getJSON('counseling/Admin/Settings/Disposition', {
            command: 'list'
        }).done(function (data) {
            this.setState({
                dispositions: data
            });
        }.bind(this));
    },

    setCurrentEdit: function setCurrentEdit(value) {
        this.setState({ currentEdit: value });
    },

    setDispositions: function setDispositions(value) {
        this.setState({ dispositions: value });
    },

    render: function render() {
        var form = null;
        var button = null;
        if (this.state.showForm) {
            form = React.createElement(
                'div',
                { className: 'form-box' },
                React.createElement(DispositionForm, { closeForm: this.closeForm, reload: this.loadData,
                    fail: this.saveFailure })
            );
        } else {
            button = React.createElement(
                'button',
                { className: 'btn btn-success', onClick: this.showForm, style: { marginBottom: '1em' } },
                'Add disposition ',
                React.createElement('i', { className: 'fa fa-caret-down' })
            );
        }
        if (this.state.saveFail) {
            alert = React.createElement(
                'div',
                { className: 'alert alert-danger' },
                React.createElement(
                    'strong',
                    null,
                    React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                    'Error:'
                ),
                'Disposition save failed'
            );
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'disposition-form-area' },
                React.createElement(
                    'div',
                    { style: { position: 'relative' } },
                    form
                ),
                React.createElement(
                    'div',
                    { style: { height: '50px' } },
                    button
                )
            ),
            alert,
            React.createElement(
                'div',
                null,
                React.createElement(DispositionList, { dispositions: this.state.dispositions, reload: this.loadData,
                    currentEdit: this.state.currentEdit, setCurrentEdit: this.setCurrentEdit,
                    showForm: this.showForm, setCurrent: this.setCurrentEdit,
                    setDispositions: this.setDispositions })
            )
        );
    }

});

var DispositionList = React.createClass({
    displayName: 'DispositionList',


    mixins: [sortable],

    getInitialState: function getInitialState() {
        return {
            dispositions: null,
            editRow: null,
            fail: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            dispositions: null,
            reload: null,
            currentEdit: null,
            setCurrentEdit: null,
            setDispositions: null
        };
    },

    edit: function edit(key) {
        this.setState({ editRow: key });
    },

    delete: function _delete(did) {
        $.post('counseling/Admin/Settings/Disposition', {
            command: 'delete',
            dispositionId: did
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    cancel: function cancel() {
        this.setState({ editRow: null });
    },

    fail: function fail() {
        this.setState({
            fail: true
        });
    },

    componentDidMount: function componentDidMount() {
        this.loadSortable('#disposition-listing');
    },

    updateSort: function updateSort(event, ui) {
        var moved = ui.item;
        var movedId = parseInt(moved.data('rowid'), 10);

        var prevRow = ui.item.prev('tr.sorting-row');
        var prevRowId = parseInt(prevRow.data('rowid'), 10);

        var nextRow = ui.item.next('tr.sorting-row');
        var nextRowId = parseInt(nextRow.data('rowid'), 10);

        $(this.refs.sortRows).sortable('cancel');

        var newList = this.resortReact(this.props.dispositions, movedId, prevRowId, nextRowId);
        this.props.setDispositions(newList);

        $.post('counseling/Admin/Settings/Disposition', {
            command: 'sort',
            moved: movedId,
            next: nextRowId,
            prev: prevRowId
        }, null, 'json').done(function (data) {}.bind(this));
    },

    render: function render() {
        var rows = null;
        var failure = null;
        if (this.props.dispositions !== null) {
            rows = this.props.dispositions.map(function (value, key) {
                if (this.state.editRow === key) {
                    return React.createElement(DispositionEditRow, _extends({ key: value.id }, value, { cancel: this.cancel, reload: this.props.reload, fail: this.fail }));
                } else {
                    return React.createElement(DispositionListRow, _extends({ key: value.id }, value, { edit: this.edit.bind(null, key), 'delete': this.delete }));
                }
            }.bind(this));
        }
        if (this.state.fail) {
            failure = React.createElement(
                'div',
                { className: 'alert alert-danger' },
                React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                '  Failed to update disposition'
            );
        }
        return React.createElement(
            'div',
            { id: 'sortBox' },
            failure,
            React.createElement(
                'table',
                { className: 'table table-striped' },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            'Action'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Name'
                        )
                    )
                ),
                React.createElement(
                    'tbody',
                    { ref: 'sortRows' },
                    rows
                )
            )
        );
    }
});

var DispositionListRow = React.createClass({
    displayName: 'DispositionListRow',

    getDefaultProps: function getDefaultProps() {
        return {
            title: null,
            icon: 'fa-times',
            color: 'default',
            id: null,
            edit: null,
            sorting: null,
            delete: null
        };
    },

    deleteCheck: function deleteCheck() {
        if (window.confirm('Are you sure you want to remove this disposition?')) {
            this.props.delete(this.props.id);
        }
    },

    render: function render() {
        var iconClass = 'fa fa-' + this.props.icon;
        var buttonClass = 'btn btn-block btn-' + this.props.color;

        return React.createElement(
            'tr',
            { className: 'sorting-row', 'data-rowid': this.props.id, id: this.props.id },
            React.createElement(
                'td',
                { className: 'col-xs-3' },
                React.createElement(
                    'button',
                    { className: 'btn btn-default handle' },
                    React.createElement('i', { className: 'fa fa-arrows' })
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-primary btn-sm', onClick: this.props.edit, title: 'Edit disposition' },
                    React.createElement('i', { className: 'fa fa-edit' })
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-danger btn-sm',
                        onClick: this.deleteCheck, title: 'Delete disposition' },
                    React.createElement('i', { className: 'fa fa-times' })
                )
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'button',
                    { className: buttonClass },
                    React.createElement('i', { className: iconClass }),
                    ' ',
                    this.props.title
                )
            )
        );
    }

});

var DispositionForm = React.createClass({
    displayName: 'DispositionForm',

    mixins: [colorPicker],

    getInitialState: function getInitialState() {
        return {
            title: '',
            color: 'default',
            icon: null,
            formError: ''
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            closeForm: null,
            reload: null,
            fail: null,
            title: '',
            color: 'default',
            icon: null,
            dispositionId: 0
        };
    },

    componentWillMount: function componentWillMount(prevProps, prevState) {
        this.setState({
            title: this.props.title,
            color: this.props.color,
            icon: this.props.icon,
            dispositionId: this.props.dispositionId
        });
    },

    componentDidMount: function componentDidMount() {
        $('#title').focus();
    },

    closeForm: function closeForm(event) {
        event.preventDefault();
        this.props.closeForm();
    },

    updateTitle: function updateTitle(event) {
        this.setState({ title: event.target.value });
    },

    save: function save(event) {
        event.preventDefault();

        if (this.state.title === null || this.state.title.length === 0) {
            $('#title').css('borderColor', 'red');
            this.setState({ formError: 'Title empty' });
            return;
        }

        this.setState({ formError: false });
        $.post('counseling/Admin/Settings/Disposition', {
            command: 'save',
            dispositionId: this.state.dispositionId,
            title: this.state.title,
            icon: this.state.icon,
            color: this.state.color
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this)).fail(function () {
            this.props.fail();
        }.bind(this)).always(function () {
            this.props.closeForm();
        }.bind(this));
    },

    pickIcon: function pickIcon(icon, event) {
        event.preventDefault();
        this.setState({
            icon: icon
        });
    },

    render: function render() {
        var alert = null;
        if (this.state.formError.length > 0) {
            alert = React.createElement(
                'div',
                { className: 'alert alert-danger', style: { fontSize: '1em' } },
                this.state.formError
            );
        }
        return React.createElement(
            'div',
            { className: 'disposition-form' },
            alert,
            React.createElement(CurrentIcon, { icon: this.state.icon, color: this.state.color, title: this.state.title }),
            React.createElement(
                'form',
                { method: 'post', action: 'counseling/Admin/Settings/Disposition' },
                React.createElement('input', { type: 'hidden', name: 'command', value: 'add' }),
                React.createElement(TextInput, { inputId: 'title', label: 'Disposition title',
                    handleChange: this.updateTitle, required: true,
                    tabIndex: 1, value: this.state.title }),
                React.createElement(
                    'label',
                    null,
                    'Button color'
                ),
                React.createElement(PickColor, { handleClick: this.pickColor }),
                React.createElement(
                    'label',
                    null,
                    'Icon'
                ),
                React.createElement(DispositionIcons, { handleClick: this.pickIcon }),
                React.createElement('hr', null),
                React.createElement(
                    'button',
                    { className: 'pull-left btn btn-primary', onClick: this.save, tabIndex: 2 },
                    React.createElement('i', { className: 'fa fa-check' }),
                    'Save Disposition'
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-danger', onClick: this.closeForm, tabIndex: 3 },
                    React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                    'Cancel'
                )
            )
        );
    }
});

var CurrentIcon = React.createClass({
    displayName: 'CurrentIcon',

    getDefaultProps: function getDefaultProps() {
        return {
            color: null,
            icon: null,
            title: ''
        };
    },

    render: function render() {
        var buttonClass = 'btn btn-block btn-lg btn-' + this.props.color;
        var iconClass = 'fa fa-' + this.props.icon;
        var title = this.props.title === null || this.props.title.length === 0 ? 'Sample' : this.props.title;

        return React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement(
                'button',
                { className: buttonClass },
                React.createElement('i', { className: iconClass }),
                ' ',
                title
            )
        );
    }

});

var DispositionIcons = React.createClass({
    displayName: 'DispositionIcons',


    getDefaultProps: function getDefaultProps() {
        return {};
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'table',
                { className: 'table' },
                React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'archive', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'automobile', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'balance-scale', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'ban', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'bank', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'bed', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'bell', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'binoculars', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'book', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'briefcase', handleClick: this.props.handleClick })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'building', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'bullhorn', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'camera', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'coffee', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'cog', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'comment', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'envelope', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'exclamation-circle', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'eye', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'flag', handleClick: this.props.handleClick })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'flask', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'folder-o', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'gavel', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'globe', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'users', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'heart', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'home', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'hourglass-1', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'calendar', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'life-ring', handleClick: this.props.handleClick })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'lightbulb-o', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'male', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'female', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'map-o', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'microphone', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'money', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'music', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'paint-brush', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'pencil', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'phone', handleClick: this.props.handleClick })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'plug', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'print', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'puzzle-piece', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'trophy', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'umbrella', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'user-plus', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'warning', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'wrench', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(IconButton, { label: 'comments-o', handleClick: this.props.handleClick })
                        ),
                        React.createElement(
                            'td',
                            null,
                            ' '
                        )
                    )
                )
            )
        );
    }

});

var IconButton = React.createClass({
    displayName: 'IconButton',

    getDefaultProps: function getDefaultProps() {
        return {
            label: null,
            handleClick: null
        };
    },

    render: function render() {
        var iconClassName = 'fa fa-' + this.props.label;
        return React.createElement(
            'button',
            { className: 'btn btn-default', onClick: this.props.handleClick.bind(null, this.props.label) },
            React.createElement('i', { className: iconClassName })
        );
    }

});

var DispositionEditRow = React.createClass({
    displayName: 'DispositionEditRow',

    componentDidMount: function componentDidMount() {
        $('.form-anchor')[0].scrollIntoView({ behavior: 'smooth' });
    },

    getDefaultProps: function getDefaultProps() {
        return {
            title: null,
            color: null,
            icon: null,
            cancel: null,
            reload: null
        };
    },

    render: function render() {
        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                { colSpan: '2' },
                React.createElement('div', { className: 'form-anchor' }),
                React.createElement(
                    'div',
                    { className: 'active-form' },
                    React.createElement(DispositionForm, {
                        closeForm: this.props.cancel,
                        reload: this.props.reload,
                        fail: this.props.fail,
                        title: this.props.title,
                        icon: this.props.icon,
                        color: this.props.color,
                        dispositionId: this.props.id
                    })
                )
            )
        );
    }
});

var Clinicians = React.createClass({
    displayName: 'Clinicians',

    mixins: [FormMixin],

    getInitialState: function getInitialState() {
        return {
            showForm: false,
            clinicians: null,
            saveFail: false,
            currentEdit: null
        };
    },

    loadData: function loadData() {
        $.getJSON('counseling/Admin/Settings/Clinician', {
            command: 'list'
        }).done(function (data) {
            this.setState({ clinicians: data });
        }.bind(this));
    },

    setCurrentEdit: function setCurrentEdit(value) {
        this.setState({ currentEdit: value });
    },

    setClinicians: function setClinicians(value) {
        this.setState({ clinicians: value });
    },

    render: function render() {
        var form = null;
        var button = null;

        if (this.state.showForm) {
            form = React.createElement(
                'div',
                { className: 'form-box' },
                React.createElement(ClinicianForm, { closeForm: this.closeForm, reload: this.loadData,
                    fail: this.saveFailure })
            );
        } else {
            button = React.createElement(
                'button',
                { className: 'btn btn-success', onClick: this.showForm,
                    style: { marginBottom: '1em' } },
                'Add clinician ',
                React.createElement('i', { className: 'fa fa-caret-down' })
            );
        }
        if (this.state.saveFail) {
            alert = React.createElement(
                'div',
                { className: 'alert alert-danger' },
                React.createElement(
                    'strong',
                    null,
                    React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                    'Error:'
                ),
                'Clinician save failed'
            );
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'clinician-form-area' },
                React.createElement(
                    'div',
                    { style: { position: 'relative' } },
                    form
                ),
                React.createElement(
                    'div',
                    { style: { height: '50px' } },
                    button
                )
            ),
            alert,
            React.createElement(
                'div',
                { className: 'clinician-listing' },
                React.createElement(ClinicianList, { clinicians: this.state.clinicians, reload: this.loadData,
                    currentEdit: this.state.currentEdit, setCurrentEdit: this.setCurrentEdit,
                    setClinicians: this.setClinicians })
            )
        );
    }

});

var ClinicianForm = React.createClass({
    displayName: 'ClinicianForm',

    getInitialState: function getInitialState() {
        return { firstName: null, lastName: null, formError: '' };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            closeForm: null,
            reload: null,
            fail: null,
            firstName: null,
            lastName: null,
            clinicianId: 0
        };
    },

    componentWillMount: function componentWillMount(prevProps, prevState) {
        this.setState({
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            clinicianId: this.props.clinicianId
        });
    },

    componentDidMount: function componentDidMount() {
        $('#firstName').focus();
    },

    closeForm: function closeForm(event) {
        event.preventDefault();
        this.props.closeForm();
    },

    updateFirstName: function updateFirstName(event) {
        this.setState({ firstName: event.target.value });
    },

    updateLastName: function updateLastName(event) {
        this.setState({ lastName: event.target.value });
    },

    save: function save(event) {
        event.preventDefault();

        if (this.state.firstName === null || this.state.firstName.length === 0) {
            $('#firstName').css('borderColor', 'red');
            this.setState({ formError: 'First name empty' });
            return;
        }
        if (this.state.lastName === null || this.state.lastName.length === 0) {
            var splitString = this.state.firstName.split(' ');
            if (splitString.length === 2) {
                this.setState({
                    firstName: splitString[0],
                    lastName: splitString[1],
                    formError: 'Last name empty. Did you type the full name in the first name field?'
                });
                return;
            }

            $('#lastName').css('borderColor', 'red');
            this.setState({ formError: 'Last name empty.' });
            return;
        }

        this.setState({ formError: false });
        $.post('counseling/Admin/Settings/Clinician', {
            command: 'save',
            clinicianId: this.state.clinicianId,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this)).fail(function () {
            this.props.fail();
        }.bind(this)).always(function () {
            this.props.closeForm();
        }.bind(this));
    },

    render: function render() {
        var alert = null;
        if (this.state.formError.length > 0) {
            alert = React.createElement(
                'div',
                { className: 'alert alert-danger', style: { fontSize: '1em' } },
                this.state.formError
            );
        }

        return React.createElement(
            'div',
            null,
            alert,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'form',
                    { method: 'post', action: 'counseling/Admin/Settings/Clinicians' },
                    React.createElement('input', { type: 'hidden', name: 'command', value: 'add' }),
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(TextInput, { inputId: 'firstName', label: 'First name',
                            handleChange: this.updateFirstName, required: true,
                            tabIndex: 1, value: this.state.firstName }),
                        React.createElement(
                            'button',
                            { className: 'pull-left btn btn-primary', onClick: this.save, tabIndex: 2 },
                            React.createElement('i', { className: 'fa fa-check' }),
                            'Save Clinician'
                        ),
                        ' ',
                        React.createElement(
                            'button',
                            { className: 'btn btn-danger', onClick: this.closeForm, tabIndex: 3 },
                            React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                            'Cancel'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        React.createElement(TextInput, { inputId: 'lastName', label: 'Last name',
                            handleChange: this.updateLastName, required: true,
                            tabIndex: 1, value: this.state.lastName })
                    )
                )
            )
        );
    }

});

var ClinicianList = React.createClass({
    displayName: 'ClinicianList',


    mixins: [sortable],

    getInitialState: function getInitialState() {
        return {
            editRow: null,
            fail: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            clinicians: null,
            reload: null,
            currentEdit: null,
            setCurrentEdit: null,
            setClinicians: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.loadSortable();
    },

    edit: function edit(key) {
        this.setState({ editRow: key });
    },

    delete: function _delete(cid) {
        $.post('counseling/Admin/Settings/Clinician', {
            command: 'delete',
            clinicianId: cid
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    cancel: function cancel() {
        this.setState({ editRow: null });
    },

    fail: function fail() {
        this.setState({
            fail: true
        });
    },

    updateSort: function updateSort(event, ui) {
        var moved = ui.item;
        var movedId = parseInt(moved.data('rowid'), 10);

        var prevRow = ui.item.prev('tr.sorting-row');
        var prevRowId = parseInt(prevRow.data('rowid'), 10);

        var nextRow = ui.item.next('tr.sorting-row');
        var nextRowId = parseInt(nextRow.data('rowid'), 10);

        $(this.refs.sortRows).sortable('cancel');

        var newList = this.resortReact(this.props.clinicians, movedId, prevRowId, nextRowId);
        this.props.setClinicians(newList);

        $.post('counseling/Admin/Settings/Clinician', {
            command: 'sort',
            moved: movedId,
            next: nextRowId,
            prev: prevRowId
        }, null, 'json').done(function (data) {}.bind(this));
    },

    render: function render() {
        var rows = null;
        var failure = null;

        if (this.props.clinicians !== null) {
            rows = this.props.clinicians.map(function (value, key) {
                if (this.state.editRow === key) {
                    return React.createElement(ClinicianEditRow, _extends({ key: value.id }, value, { cancel: this.cancel, reload: this.props.reload, fail: this.fail }));
                } else {
                    return React.createElement(ClinicianListRow, _extends({ key: value.id }, value, { edit: this.edit.bind(null, key),
                        'delete': this.delete }));
                }
            }.bind(this));
        }

        if (this.state.fail) {
            failure = React.createElement(
                'div',
                { className: 'alert alert-danger' },
                React.createElement('i', { className: 'fa fa-exclamation-triangle' }),
                '  Failed to update clinician'
            );
        }
        return React.createElement(
            'div',
            { id: 'sortBox' },
            failure,
            React.createElement(
                'table',
                { className: 'table table-striped' },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            ' '
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Name'
                        )
                    )
                ),
                React.createElement(
                    'tbody',
                    { ref: 'sortRows' },
                    rows
                )
            )
        );
    }
});

var ClinicianListRow = React.createClass({
    displayName: 'ClinicianListRow',

    getDefaultProps: function getDefaultProps() {
        return {
            first_name: null,
            last_name: null,
            id: null,
            edit: null,
            delete: null
        };
    },

    render: function render() {
        return React.createElement(
            'tr',
            { className: 'sorting-row', 'data-rowid': this.props.id, id: this.props.id },
            React.createElement(
                'td',
                { className: 'col-sm-3' },
                React.createElement(
                    'button',
                    { className: 'btn btn-default handle' },
                    React.createElement('i', { className: 'fa fa-arrows' })
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-primary btn-sm', onClick: this.props.edit, title: 'Edit clinician' },
                    React.createElement('i', { className: 'fa fa-edit' })
                ),
                ' ',
                React.createElement(
                    'button',
                    { className: 'btn btn-danger btn-sm',
                        onClick: this.props.delete.bind(null, this.props.id), title: 'Delete clinician' },
                    React.createElement('i', { className: 'fa fa-times' })
                )
            ),
            React.createElement(
                'td',
                null,
                this.props.first_name,
                ' ',
                this.props.last_name
            )
        );
    }

});

var ClinicianEditRow = React.createClass({
    displayName: 'ClinicianEditRow',

    getDefaultProps: function getDefaultProps() {
        return {
            first_name: null,
            last_name: null,
            cancel: null,
            reload: null
        };
    },

    render: function render() {
        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                { colSpan: '2' },
                React.createElement(ClinicianForm, {
                    closeForm: this.props.cancel,
                    reload: this.props.reload,
                    fail: this.props.fail,
                    firstName: this.props.first_name,
                    lastName: this.props.last_name,
                    clinicianId: this.props.id
                })
            )
        );
    }

});

var SettingsDashboard = React.createClass({
    displayName: 'SettingsDashboard',

    getInitialState: function getInitialState() {
        return {
            tab: 'Reasons'
        };
    },

    selectTab: function selectTab(tab) {
        this.setState({ tab: tab });
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'settingsDashboard' },
            React.createElement(
                'h2',
                null,
                'Counseling Check-In Settings'
            ),
            React.createElement(
                'ul',
                { className: 'nav nav-tabs' },
                React.createElement(Tab, { active: this.state.tab == 'Clinicians', label: 'Clinicians', handleClick: this.selectTab.bind(this, 'Clinicians') }),
                React.createElement(Tab, { active: this.state.tab == 'Reasons', label: 'Reasons', handleClick: this.selectTab.bind(this, 'Reasons') }),
                React.createElement(Tab, { active: this.state.tab == 'Dispositions', label: 'Dispositions', handleClick: this.selectTab.bind(this, 'Dispositions') })
            ),
            React.createElement(
                'div',
                { style: { marginTop: '1em' } },
                React.createElement(Content, { tab: this.state.tab })
            )
        );
    }

});

var Tab = React.createClass({
    displayName: 'Tab',

    getDefaultProps: function getDefaultProps() {
        return {
            active: false,
            label: null
        };
    },

    render: function render() {
        return React.createElement(
            'li',
            { role: 'presentation', onClick: this.props.handleClick, className: this.props.active ? 'active' : null },
            React.createElement(
                'a',
                { className: 'pointer' },
                this.props.label
            )
        );
    }

});

var Content = React.createClass({
    displayName: 'Content',

    mixins: ['TextInput'],

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {
            tab: null
        };
    },

    render: function render() {
        var content = null;
        switch (this.props.tab) {
            case 'Clinicians':
                content = React.createElement(Clinicians, null);
                break;

            case 'Reasons':
                content = React.createElement(Reasons, null);
                break;

            case 'Visitors':
                content = React.createElement(Visitors, null);
                break;

            case 'Visits':
                content = React.createElement(Visits, null);
                break;

            case 'Dispositions':
                content = React.createElement(Dispositions, null);
                break;
        }

        return React.createElement(
            'div',
            null,
            content
        );
    }

});

var BoolIcon = React.createClass({
    displayName: 'BoolIcon',

    getDefaultProps: function getDefaultProps() {
        return {
            bool: true,
            handleClick: null
        };
    },

    render: function render() {
        var _className = this.props.bool === '1' ? 'fa fa-thumbs-o-up text-success' : 'fa fa-thumbs-o-down text-danger';

        if (this.props.handleClick !== null) {
            _className += ' pointer';
        }

        return React.createElement('i', { className: _className, onClick: this.props.handleClick });
    }
});

ReactDOM.render(React.createElement(SettingsDashboard, null), document.getElementById('settings-dashboard'));

var Visitors = React.createClass({
    displayName: 'Visitors',

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {};
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            'Visitors'
        );
    }

});

var Visits = React.createClass({
    displayName: 'Visits',

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {};
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            'Visits'
        );
    }

});
//# sourceMappingURL=script.js.map
