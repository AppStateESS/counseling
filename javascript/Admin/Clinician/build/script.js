'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ClinicianChoose = React.createClass({
    displayName: 'ClinicianChoose',

    getInitialState: function getInitialState() {
        return {
            timeframe: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.setTimeframe();
    },

    getDefaultProps: function getDefaultProps() {
        return {
            clinicians: null,
            choose: null
        };
    },

    setTimeframe: function setTimeframe() {
        var timeframe;
        var date = new Date();
        var hours = date.getHours();
        switch (hours) {
            case hours < 12:
                timeframe = 'Morning';
                break;

            case hours > 17:
                timeframe = 'Evening';
                break;

            default:
                timeframe = 'Afternoon';
                break;
        }
        this.setState({
            timeframe: timeframe
        });
    },

    render: function render() {
        var rows = null;

        if (this.props.clinicians !== null && this.props.clinicians.length > 0) {
            rows = this.props.clinicians.map(function (value, key) {
                return React.createElement(ClinicianRow, _extends({ key: key }, value, { choose: this.props.choose.bind(null, key) }));
            }.bind(this));
        } else {
            rows = React.createElement(
                'p',
                null,
                'No clinicians found in system.'
            );
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                'Good ',
                this.state.timeframe,
                '!'
            ),
            React.createElement('hr', null),
            React.createElement(
                'h3',
                null,
                'Please click/touch your name to continue...'
            ),
            React.createElement(
                'div',
                { className: 'row clinician-container' },
                rows
            )
        );
    }

});

var ClinicianRow = React.createClass({
    displayName: 'ClinicianRow',

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {
            first_name: null,
            last_name: null,
            id: null,
            choose: null
        };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'col-sm-12 col-md-6' },
            React.createElement(
                'button',
                { className: 'clinician btn btn-primary btn-lg btn-block', onClick: this.props.choose },
                this.props.first_name,
                ' ',
                this.props.last_name
            )
        );
    }

});

var CompleteVisit = React.createClass({
    displayName: 'CompleteVisit',

    getInitialState: function getInitialState() {
        return {
            dispositions: []
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            seen: null,
            clinician: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.loadData();
    },

    loadData: function loadData() {
        $.getJSON('counseling/Admin/Clinician', {
            command: 'dispositionList'
        }).done(function (data) {
            this.setState({
                dispositions: data
            });
        }.bind(this));
    },

    handleClick: function handleClick(dispositionId) {
        $.post('counseling/Admin/Clinician', {
            command: 'assignDisposition',
            dispositionId: dispositionId,
            visitId: this.props.seen.id
        }, null, 'json').done(function (data) {
            this.props.setStage('selectVisitor');
        }.bind(this));
    },

    render: function render() {

        var dispositions = null;
        var buttonClass = null;
        var iconClass = null;

        dispositions = this.state.dispositions.map(function (value, key) {
            buttonClass = 'btn btn-lg btn-block btn-' + value.color;
            iconClass = 'fa fa-' + value.icon;
            return React.createElement(
                'button',
                { key: key, className: buttonClass, onClick: this.handleClick.bind(null, value.id) },
                React.createElement('i', { className: iconClass }),
                ' ',
                value.title
            );
        }.bind(this));

        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                this.props.clinician.first_name,
                ' ',
                this.props.clinician.last_name,
                ' meeting with ',
                this.props.seen.preferred_name,
                ' ',
                this.props.seen.last_name
            ),
            React.createElement(
                'h3',
                null,
                'If your consultation is complete, choose a disposition below.'
            ),
            dispositions,
            React.createElement('hr', null),
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'button',
                    { className: 'btn btn-default btn-lg', onClick: this.props.goBack },
                    React.createElement('i', { className: 'fa fa-undo' }),
                    ' Go Back'
                )
            )
        );
    }

});

var ClinicianTimeout = null;

var ClinicianDashboard = React.createClass({
    displayName: 'ClinicianDashboard',

    getInitialState: function getInitialState() {
        return {
            clinicians: null,
            currentClinician: null,
            stage: 'choose',
            currentlySeen: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.loadData();
    },

    loadData: function loadData() {
        $.getJSON('counseling/Admin/Clinician', {
            command: 'list'
        }).done(function (data) {
            this.setState({
                clinicians: data
            });
        }.bind(this));
    },

    loadSeen: function loadSeen(clinician) {
        $.getJSON('counseling/Admin/Clinician', {
            command: 'currentlySeen',
            clinicianId: clinician.id
        }).done(function (data) {
            if (data !== false) {
                this.setState({
                    currentlySeen: data,
                    stage: 'completeVisit',
                    currentClinician: clinician
                });
            } else {
                this.setState({
                    currentlySeen: null,
                    stage: 'selectVisitor',
                    currentClinician: clinician
                });
            }
        }.bind(this));
    },

    choose: function choose(key) {
        var clinician = this.state.clinicians[key];
        this.loadSeen(clinician);
    },

    setStage: function setStage(stage) {
        this.setState({
            stage: stage
        });
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (this.state.stage == 'reset') {
            ClinicianTimeout = setTimeout(function () {
                this.setStage('choose');
            }.bind(this), 5000);
        }
    },

    goBack: function goBack() {
        clearTimeout(ClinicianTimeout);
        this.setStage('choose');
    },

    render: function render() {
        switch (this.state.stage) {
            case 'choose':
                return React.createElement(ClinicianChoose, { clinicians: this.state.clinicians, choose: this.choose });
                break;

            case 'selectVisitor':
                return React.createElement(SelectVisitor, { clinician: this.state.currentClinician, setStage: this.setStage });
                break;

            case 'completeVisit':
                return React.createElement(CompleteVisit, { clinician: this.state.currentClinician, seen: this.state.currentlySeen, goBack: this.goBack, setStage: this.setStage });
                break;

            case 'reset':
                return React.createElement(
                    'div',
                    { className: 'well text-center' },
                    React.createElement(
                        'h2',
                        null,
                        'Thank you.'
                    ),
                    React.createElement(
                        'h3',
                        null,
                        'Return on completion of your consultation.'
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn btn-default btn-lg', onClick: this.goBack },
                        React.createElement('i', { className: 'fa fa-undo' }),
                        ' Go Back'
                    )
                );
        }
    }

});

ReactDOM.render(React.createElement(ClinicianDashboard, null), document.getElementById('clinician-dashboard'));

var SelectVisitor = React.createClass({
    displayName: 'SelectVisitor',

    getInitialState: function getInitialState() {
        return { waiting: null, emergencies: null, selectedVisit: null };
    },

    getDefaultProps: function getDefaultProps() {
        return { clinician: null };
    },

    componentDidMount: function componentDidMount() {
        this.loadData();
    },

    loadData: function loadData() {
        $.getJSON('counseling/Admin/Clinician', { command: 'visitorList' }).done(function (data) {
            if (data !== null) {
                this.setState({ waiting: data.waiting, emergencies: data.emergencies });
            }
        }.bind(this));
    },

    goBack: function goBack() {
        this.props.setStage('choose');
    },

    reset: function reset() {
        this.setState({ selectedVisit: null });
    },

    select: function select(visit) {
        this.setState({ selectedVisit: visit });
    },

    startConsultation: function startConsultation() {
        var visitId = this.state.selectedVisit.id;
        var clinicianId = this.props.clinician.id;
        $.post('counseling/Admin/Clinician/', {
            command: 'selectVisit',
            visitId: visitId,
            clinicianId: clinicianId
        }, null, 'json').done(function (data) {
            this.reset();
            this.props.setStage('reset');
        }.bind(this));
    },


    render: function render() {
        if (this.state.selectedVisit !== null) {
            return React.createElement(ConfirmVisitor, {
                visit: this.state.selectedVisit,
                goBack: this.reset,
                startConsultation: this.startConsultation });
        }

        var listing = null;
        if (this.state.waiting === null && this.state.emergencies === null) {
            listing = React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'alert alert-info' },
                    'No visitors are currently waiting.'
                ),
                React.createElement(
                    'div',
                    { className: 'go-back text-center' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-default btn-lg', onClick: this.goBack },
                        React.createElement('i', { className: 'fa fa-undo' }),
                        'Go Back'
                    )
                )
            );
        } else {
            listing = React.createElement(SelectVisitorListing, {
                waiting: this.state.waiting,
                emergencies: this.state.emergencies,
                setStage: this.props.setStage,
                clinician: this.props.clinician,
                reload: this.loadData,
                goBack: this.goBack,
                select: this.select });
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                'Hello ',
                this.props.clinician.first_name
            ),
            React.createElement('hr', null),
            ' ',
            listing
        );
    }
});

var ConfirmVisitor = React.createClass({
    displayName: 'ConfirmVisitor',

    getDefaultProps: function getDefaultProps() {
        return { visit: null };
    },

    render: function render() {
        var visitor = this.props.visit.visitor;
        return React.createElement(
            'div',
            { className: 'text-center well' },
            React.createElement(
                'h2',
                null,
                'You have chosen to start a consulation with ',
                visitor.preferred_name,
                visitor.last_name
            ),
            React.createElement(
                'div',
                { className: 'go-back' },
                React.createElement(
                    'button',
                    {
                        className: 'btn btn-success btn-lg',
                        style: {
                            marginBottom: '1em'
                        },
                        onClick: this.props.startConsultation },
                    React.createElement('i', { className: 'fa fa-check' }),
                    'Start consultation'
                ),
                React.createElement('br', null),
                React.createElement(
                    'button',
                    { className: 'btn btn-default btn-3x', onClick: this.props.goBack },
                    React.createElement('i', { className: 'fa fa-undo' }),
                    'Start over'
                )
            )
        );
    }
});

var SelectVisitorListing = React.createClass({
    displayName: 'SelectVisitorListing',

    getDefaultProps: function getDefaultProps() {
        return { waiting: null, emergencies: null };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'visitor-listing' },
            React.createElement(Emergencies, {
                list: this.props.emergencies,
                clinician: this.props.clinician,
                select: this.props.select }),
            React.createElement(Waiting, {
                waiting: this.props.waiting,
                clinician: this.props.clinician,
                select: this.props.select }),
            React.createElement(
                'div',
                { className: 'go-back text-center' },
                React.createElement(
                    'button',
                    { className: 'btn btn-default btn-lg', onClick: this.props.goBack },
                    React.createElement('i', { className: 'fa fa-undo' }),
                    'Go Back'
                )
            )
        );
    }
});

var Emergencies = React.createClass({
    displayName: 'Emergencies',

    getDefaultProps: function getDefaultProps() {
        return { list: null, clinician: null, select: null };
    },

    render: function render() {
        if (this.props.list === null || this.props.list.length === 0) {
            return null;
        } else {
            var visits = this.props.list.map(function (value, key) {
                return React.createElement(VisitorRow, _extends({
                    key: value.id
                }, value, {
                    clinician: this.props.clinician,
                    buttonClass: 'danger',
                    select: this.props.select.bind(null, value) }));
            }.bind(this));

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h3',
                    null,
                    'Emergencies'
                ),
                visits
            );
        }
    }
});

var Waiting = React.createClass({
    displayName: 'Waiting',

    getDefaultProps: function getDefaultProps() {
        return { waiting: null, clinician: null };
    },

    render: function render() {
        var visits = React.createElement(
            'div',
            null,
            'No walk-ins waiting'
        );
        if (this.props.waiting !== null && this.props.waiting.length !== 0) {
            visits = this.props.waiting.map(function (value, key) {
                return React.createElement(VisitorRow, _extends({
                    key: value.id
                }, value, {
                    clinician: this.props.clinician,
                    buttonClass: value.color,
                    select: this.props.select.bind(null, value) }));
            }.bind(this));
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'Waiting'
            ),
            visits
        );
    }
});

var VisitorRow = React.createClass({
    displayName: 'VisitorRow',

    getDefaultProps: function getDefaultProps() {
        return { visitor: null, buttonClass: 'success', clinician: null, select: null };
    },

    render: function render() {
        var _className = 'btn btn-block btn-lg btn-' + this.props.buttonClass;
        var waiting = null;
        if (this.props.category == '1') {
            waiting = React.createElement(
                'span',
                null,
                ' - Waiting: ',
                this.props.wait_time,
                ' min.'
            );
        }
        var preferredName = this.props.visitor.preferred_name !== null ? this.props.visitor.preferred_name : this.props.visitor.first_name;
        return React.createElement(
            'button',
            { className: _className, onClick: this.props.select },
            React.createElement(CategoryIcon, { category: this.props.category, title: this.props.reason_title }),
            ' ',
            React.createElement(
                'strong',
                null,
                preferredName,
                ' ',
                this.props.visitor.last_name
            ),
            waiting
        );
    }
});

var CategoryIcon = React.createClass({
    displayName: 'CategoryIcon',

    getDefaultProps: function getDefaultProps() {
        return { category: 0, title: null };
    },

    render: function render() {
        var icon = null;
        var _className = 'category fa fa-lg ' + categoryIcons[this.props.category];
        icon = React.createElement('i', { className: _className, title: this.props.title });
        return React.createElement(
            'span',
            null,
            icon
        );
    }
});
//# sourceMappingURL=script.js.map
