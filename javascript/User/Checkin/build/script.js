'use strict';

var errorTimeout = {
    componentDidUpdate: function componentDidUpdate() {
        if (this.state.error === true) {
            this.interval = setTimeout((function () {
                this.resetForm();
            }).bind(this), 5000);
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        clearTimeout(this.interval);
    },

    resetForm: function resetForm() {
        clearTimeout(this.interval);
        this.setState({
            error: false
        });
    }
};

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var swipeTimeout = null;

var Swipe = React.createClass({
    displayName: 'Swipe',

    mixins: [errorTimeout],

    getInitialState: function getInitialState() {
        return {
            error: 0,
            visitor: null
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            handleClick: null
        };
    },

    loginFailure: function loginFailure() {
        this.setState({
            visitor: '',
            error: 1
        });
        this.timedReset();
    },

    alreadyVisiting: function alreadyVisiting() {
        this.setState({
            visitor: '',
            error: 2
        });
    },

    timedReset: function timedReset() {
        swipeTimeout = setTimeout((function () {
            this.resetSwipe();
        }).bind(this), 4000);
    },

    resetSwipe: function resetSwipe() {
        clearTimeout(swipeTimeout);
        this.setState({
            error: 0,
            visitor: null
        });
    },

    logInVisitor: function logInVisitor() {
        var visitor = this.state.visitor;
        if (visitor && visitor.length > 3) {
            if (visitor.charAt(0) === ';' && visitor.charAt(10) === '=') {
                visitor = visitor.slice(1, 10);
            }

            $.getJSON('counseling/User/Checkin', {
                command: 'loginVisitor',
                bannerId: visitor
            }).done((function (data) {
                if (data.waiting !== undefined) {
                    this.alreadyVisiting();
                    this.timedReset();
                } else if (data.visitor === null) {
                    this.loginFailure();
                } else {
                    this.props.update(data);
                }
            }).bind(this)).fail((function () {
                this.loginFailure();
            }).bind(this));
        } else {
            this.loginFailure();
        }
    },

    handleChange: function handleChange(e) {
        var character = e.target.value;
        this.setState({
            visitor: character
        });
    },

    submitVisitor: function submitVisitor(e) {
        e.preventDefault();
        this.logInVisitor();
    },

    focusSwiper: function focusSwiper() {
        $('#swiper').focus();
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        this.focusSwiper();
    },

    componentDidMount: function componentDidMount(prevProps, prevState) {
        this.focusSwiper();
    },

    render: function render() {
        var field = null;
        var button = null;

        if (this.state.error === 1) {
            field = React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'div',
                    { className: 'alert alert-danger alert-dismissible', role: 'alert', ref: 'errorAlert' },
                    'Account not found. Please try again or see the front desk.'
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-default', type: 'button', onClick: this.resetSwipe },
                    React.createElement('i', { className: 'fa fa-repeat' }),
                    ' Try again'
                )
            );
        } else if (this.state.error === 2) {
            field = React.createElement(
                'div',
                { className: 'alert alert-warning alert-dismissible', role: 'alert', ref: 'errorAlert' },
                React.createElement(
                    'button',
                    { className: 'close', type: 'button', onClick: this.resetSwipe },
                    React.createElement('i', { className: 'fa fa-times' })
                ),
                'You are already logged in. Please visit the front desk if you have a question or concern.'
            );
        } else {
            field = React.createElement('input', { id: 'swiper', type: 'text', placeholder: 'Banner ID', onChange: this.handleChange,
                className: 'form-control', value: this.state.visitor });
            button = React.createElement(
                'button',
                { className: 'continue pull-right btn btn-default', onClick: this.logInVisitor },
                'Continue ',
                React.createElement('i', { className: 'fa fa-chevron-right fa-sm' })
            );
        }

        var content = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'p',
                    { className: 'title' },
                    'Welcome! Please Check-in'
                ),
                React.createElement(
                    'p',
                    { className: 'subtitle' },
                    'Swipe your AppCard to get started'
                ),
                React.createElement(
                    'p',
                    null,
                    'Don\'t have your AppCard?',
                    React.createElement('br', null),
                    'Enter your Banner ID number instead.'
                ),
                React.createElement(
                    'form',
                    { onSubmit: this.submitVisitor },
                    field
                )
            ),
            button,
            React.createElement('div', { className: 'clearfix' })
        );
        return React.createElement(Box, { content: content });
    }

});

var Reason = React.createClass({
    displayName: 'Reason',

    getInitialState: function getInitialState() {
        return {
            reasons: null
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            update: null, // function to run upon reason selection
            visitor: null, //visitor object
            update: null // function to set parent's reason
        };
    },

    componentDidMount: function componentDidMount() {
        $.getJSON('counseling/User/Reason', {
            command: 'list'
        }).done((function (data) {
            if (data === null) {
                data = [];
            }
            this.setState({
                reasons: data
            });
        }).bind(this));
    },

    pickReason: function pickReason(key) {
        this.props.update(this.state.reasons[key]);
    },

    render: function render() {
        var content;

        if (this.state.reasons === null) {
            content = 'Loading...';
        } else if (this.state.reasons.length === 0) {
            content = React.createElement(
                'div',
                { className: 'alert alert-danger' },
                'System error: Please alert front desk.'
            );
        } else {
            var reasonList = this.state.reasons.map((function (value, i) {
                return React.createElement(
                    'li',
                    { key: i, className: 'list-group-item', style: { cursor: 'pointer' }, onClick: this.pickReason.bind(this, i) },
                    value.description
                );
            }).bind(this));
            content = React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'text-center' },
                    React.createElement(
                        'p',
                        { className: 'title' },
                        'Hello, ',
                        this.props.visitor.preferred_name,
                        '.'
                    ),
                    React.createElement(
                        'p',
                        { className: 'title' },
                        'Why are you visiting today?'
                    )
                ),
                React.createElement(
                    'ul',
                    { className: 'list-group' },
                    reasonList
                )
            );
        }

        return React.createElement(Box, { content: content });
    }

});

var Phone = React.createClass({
    displayName: 'Phone',

    mixins: [errorTimeout],

    getInitialState: function getInitialState() {
        return {
            phoneNumber: '',
            error: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            update: null,
            visitor: null,
            back: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.setState({
            phoneNumber: this.props.visitor.phone_number
        });
    },

    updatePhone: function updatePhone() {
        if (this.state.phoneNumber.length < 10) {
            this.setState({ error: true });
        } else {
            this.props.update(this.state.phoneNumber);
        }
    },

    handleChange: function handleChange(e) {
        this.setState({
            phoneNumber: e.target.value
        });
    },

    render: function render() {
        var field = null;
        if (this.state.error) {
            field = React.createElement(
                'div',
                { className: 'alert alert-danger alert-dismissible', role: 'alert', ref: 'errorAlert' },
                React.createElement(
                    'button',
                    { className: 'close', type: 'button', onClick: this.resetForm },
                    React.createElement('i', { className: 'fa fa-times' })
                ),
                'Please enter your cell phone number including your area code.'
            );
        } else {
            field = React.createElement('input', { type: 'text', ref: 'phone', className: 'form-control', placeholder: 'Cell phone number with area code',
                value: this.state.phoneNumber, onChange: this.handleChange });
        }

        var content = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'p',
                    { className: 'title' },
                    'Ok, ',
                    this.props.visitor.preferred_name,
                    '.'
                ),
                React.createElement(
                    'p',
                    { className: 'subtitle' },
                    'In case we need to reach you later,',
                    React.createElement('br', null),
                    'please enter your cell phone number.'
                ),
                field,
                React.createElement(
                    'button',
                    { className: 'continue pull-left btn btn-default', onClick: this.props.back },
                    React.createElement(
                        'i',
                        { className: 'fa fa-chevron-left fa-sm' },
                        ' Back '
                    )
                ),
                React.createElement(
                    'button',
                    { className: 'continue pull-right btn btn-default', onClick: this.updatePhone },
                    'Continue ',
                    React.createElement('i', { className: 'fa fa-chevron-right fa-sm' })
                ),
                React.createElement('div', { className: 'clearfix' })
            )
        );

        return React.createElement(Box, { content: content });
    }

});

var Emergency = React.createClass({
    displayName: 'Emergency',

    getDefaultProps: function getDefaultProps() {
        return {
            update: null
        };
    },

    hasEmergency: function hasEmergency(answer) {
        this.props.update(answer);
    },

    render: function render() {
        var content = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'p',
                    { className: 'title' },
                    'A few quick questions'
                ),
                React.createElement(
                    'p',
                    { className: 'subtitle' },
                    'Are you currently experiencing an emergency?'
                ),
                React.createElement(
                    'p',
                    { style: { textAlign: 'left' } },
                    'Examples of emergencies include recent:'
                ),
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        'suicidal crisis'
                    ),
                    React.createElement(
                        'li',
                        null,
                        'sexual assault'
                    ),
                    React.createElement(
                        'li',
                        null,
                        'homicidal thoughts'
                    ),
                    React.createElement(
                        'li',
                        null,
                        'death of a friend or loved one'
                    ),
                    React.createElement(
                        'li',
                        null,
                        'unusual experiences such as hearing voices or seeing things other people do not'
                    ),
                    React.createElement(
                        'li',
                        null,
                        'serious accident'
                    ),
                    React.createElement(
                        'li',
                        null,
                        'other similar events'
                    )
                ),
                React.createElement(
                    'button',
                    { style: { marginRight: '1em', width: '100px' }, className: 'btn btn-default btn-lg', onClick: this.hasEmergency.bind(this, true) },
                    'Yes'
                ),
                React.createElement(
                    'button',
                    { style: { width: '100px' }, className: 'btn btn-default btn-lg', onClick: this.hasEmergency.bind(this, false) },
                    'No'
                )
            ),
            React.createElement('div', { className: 'clearfix' })
        );
        return React.createElement(Box, { content: content });
    }

});

var Instruction = React.createClass({
    displayName: 'Instruction',

    getInitialState: function getInitialState() {
        return {
            instructions: null
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            instruction: '1',
            instructionList: null,
            reset: null
        };
    },

    render: function render() {
        var content = null;
        var instruction = null;

        if (this.props.instruction === '1') {
            instruction = this.props.instructionList['1'];
        } else {
            instruction = this.props.instructionList['2'];
        }

        content = React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'text-center' },
                React.createElement(
                    'p',
                    { className: 'title' },
                    'Ok, you\'re checked in.'
                ),
                React.createElement(
                    'p',
                    { className: 'subtitle' },
                    instruction
                )
            ),
            React.createElement(
                'div',
                { className: 'text-right' },
                React.createElement(
                    'button',
                    { className: 'btn btn-default', onClick: this.props.reset },
                    'Finished'
                )
            )
        );

        return React.createElement(Box, { content: content });
    }

});

'use strict';

var resetTimeout = null;

var Login = React.createClass({
    displayName: 'Login',

    getInitialState: function getInitialState() {
        return {
            stage: 'swipe'
        };
    },

    updateStage: function updateStage(stage) {
        this.setState({
            stage: stage
        });
    },

    render: function render() {
        return React.createElement(Stage, { updateStage: this.updateStage, stage: this.state.stage });
    }

});

var Stage = React.createClass({
    displayName: 'Stage',

    getInitialState: function getInitialState() {
        return {
            visitor: null,
            reason: null,
            phone: null,
            emergency: false,
            instructionList: null
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            stage: 'swipe'
        };
    },

    componentDidMount: function componentDidMount() {
        $.getJSON('counseling/User/Checkin', {
            command: 'instructions'
        }).done((function (data) {
            this.setState({
                instructionList: data
            });
        }).bind(this));
    },

    updateReason: function updateReason(reason) {
        this.setState({
            reason: reason
        });
        if (reason.ask_for_phone === '1') {
            this.props.updateStage('phone');
        } else {
            if (reason.show_emergency === '1') {
                this.props.updateStage('emergency');
            } else {
                this.props.updateStage('instruction');
            }
        }
    },

    updateVisitor: function updateVisitor(visitor) {
        this.setState({
            visitor: visitor
        });
        this.props.updateStage('reason');
    },

    updatePhone: function updatePhone(phone) {
        if (phone === null || phone.length === 0) {
            return;
        }
        //update phone number if changed
        if (phone !== this.state.visitor.phone_number) {
            $.post('counseling/User/Visitor', {
                command: 'updatePhone',
                visitorId: this.state.visitor.id,
                phoneNumber: phone
            }, null, 'json').done((function (data) {
                //console.log(data);
            }).bind(this));
        }

        this.setState({
            phone: phone
        });
        if (this.state.reason.show_emergency === '1') {
            this.props.updateStage('emergency');
        } else {
            this.props.updateStage('instruction');
        }
    },

    updateEmergency: function updateEmergency(emergency) {
        this.setState({
            emergency: emergency
        });
        this.props.updateStage('instruction');
    },

    componentDidUpdate: function componentDidUpdate(props, state) {
        if (this.props.stage === 'instruction') {
            this.completeCheckin();
        }
    },

    completeCheckin: function completeCheckin() {
        if (this.state.reason.wait_listed === '1') {
            $.post('counseling/User/Visit', {
                command: 'create',
                visitorId: this.state.visitor.id,
                reasonId: this.state.reason.id,
                emergency: this.state.emergency
            }, null, 'json').done((function (data) {
                resetTimeout = setTimeout(this.resetLogin, 5000);
            }).bind(this));
        } else {
            resetTimeout = setTimeout(this.resetLogin, 5000);
        }
    },

    resetLogin: function resetLogin() {
        clearTimeout(resetTimeout);
        this.props.updateStage('swipe');
        this.setState({
            visitor: null,
            reason: null,
            phone: null,
            emergency: false
        });
    },

    backToReason: function backToReason() {
        this.setState({
            reason: null
        });
        this.props.updateStage('reason');
    },

    render: function render() {
        var content = null;
        switch (this.props.stage) {
            case 'swipe':
                return React.createElement(Swipe, { update: this.updateVisitor });
                break;

            case 'reason':
                return React.createElement(Reason, { update: this.updateReason, visitor: this.state.visitor });
                break;

            case 'phone':
                return React.createElement(Phone, { update: this.updatePhone, visitor: this.state.visitor, back: this.backToReason });
                break;

            case 'emergency':
                return React.createElement(Emergency, { update: this.updateEmergency });
                break;

            case 'instruction':
                return React.createElement(Instruction, { reset: this.resetLogin, instruction: this.state.reason.instruction, instructionList: this.state.instructionList });
                break;
        }
    }

});

var Box = React.createClass({
    displayName: 'Box',

    getDefaultProps: function getDefaultProps() {
        return {
            content: 'Empty'
        };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'checkin-box' },
            this.props.content
        );
    }

});

ReactDOM.render(React.createElement(Login, null), document.getElementById('Login'));
