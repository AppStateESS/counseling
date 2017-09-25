var SelectVisitor = React.createClass({
    getInitialState: function() {
        return {waiting: null, emergencies: null, selectedVisit: null,};
    },

    getDefaultProps: function() {
        return {clinician: null};
    },

    componentDidMount: function() {
        this.loadData();
    },

    loadData: function() {
        $.getJSON('counseling/Admin/Clinician', {command: 'visitorList'}).done(function(data) {
            if (data !== null) {
                this.setState({waiting: data.waiting, emergencies: data.emergencies,});
            }
        }.bind(this));
    },

    goBack: function() {
        this.props.setStage('choose');
    },

    reset: function() {
        this.setState({selectedVisit: null});
    },

    select: function(visit) {
        this.setState({selectedVisit: visit});
    },

    startConsultation() {
        var visitId = this.state.selectedVisit.id;
        var clinicianId = this.props.clinician.id;
        $.post('counseling/Admin/Clinician/', {
            command: 'selectVisit',
            visitId: visitId,
            clinicianId: clinicianId,
        }, null, 'json').done(function(data) {
            this.reset();
            this.props.setStage('reset');
        }.bind(this));
    },

    render: function() {
        if (this.state.selectedVisit !== null) {
            return <ConfirmVisitor
                visit={this.state.selectedVisit}
                goBack={this.reset}
                startConsultation={this.startConsultation}/>;
        }

        var listing = null;
        if (this.state.waiting === null && this.state.emergencies === null) {
            listing = (
                <div>
                    <div className="alert alert-info">No visitors are currently waiting.</div>
                    <div className="go-back text-center">
                        <button className="btn btn-default btn-lg" onClick={this.goBack}>
                            <i className="fa fa-undo"></i>
                            Go Back</button>
                    </div>
                </div>
            );
        } else {
            listing = <SelectVisitorListing
                waiting={this.state.waiting}
                emergencies={this.state.emergencies}
                setStage={this.props.setStage}
                clinician={this.props.clinician}
                reload={this.loadData}
                goBack={this.goBack}
                select={this.select}/>;
        }
        return (
            <div>
                <h2>Hello {this.props.clinician.first_name}</h2>
                <hr/> {listing}
            </div>
        );
    },
});

var ConfirmVisitor = React.createClass({
    getDefaultProps: function() {
        return {visit: null};
    },

    render: function() {
        var visitor = this.props.visit.visitor;
        return (
            <div className="text-center well">
                <h2>You have chosen to start a consulation with {visitor.preferred_name}
                    {visitor.last_name}</h2>
                <div className="go-back">
                    <button
                        className="btn btn-success btn-lg"
                        style={{
                        marginBottom: '1em'
                    }}
                        onClick={this.props.startConsultation}>
                        <i className="fa fa-check"></i>
                        Start consultation</button><br/>
                    <button className="btn btn-default btn-3x" onClick={this.props.goBack}>
                        <i className="fa fa-undo"></i>
                        Start over</button>
                </div>
            </div>
        );
    },
});

var SelectVisitorListing = React.createClass({
    getDefaultProps: function() {
        return {waiting: null, emergencies: null,};
    },

    render: function() {
        return (
            <div className='visitor-listing'>
                <Emergencies
                    list={this.props.emergencies}
                    clinician={this.props.clinician}
                    select={this.props.select}/>
                <Waiting
                    waiting={this.props.waiting}
                    clinician={this.props.clinician}
                    select={this.props.select}/>
                <div className="go-back text-center">
                    <button className="btn btn-default btn-lg" onClick={this.props.goBack}>
                        <i className="fa fa-undo"></i>
                        Go Back</button>
                </div>
            </div>
        );
    },
});

var Emergencies = React.createClass({
    getDefaultProps: function() {
        return {list: null, clinician: null, select: null,};
    },

    render: function() {
        if (this.props.list === null || this.props.list.length === 0) {
            return null;
        } else {
            var visits = this.props.list.map(function(value, key) {
                return (<VisitorRow
                    key={value.id}
                    {...value}
                    clinician={this.props.clinician}
                    buttonClass="danger"
                    select={this.props.select.bind(null, value)}/>);
            }.bind(this));

            return (
                <div>
                    <h3>Emergencies</h3>
                    {visits}
                </div>
            );
        }
    },
});

var Waiting = React.createClass({
    getDefaultProps: function() {
        return {waiting: null, clinician: null,};
    },

    render: function() {
        let visits = <div>No walk-ins waiting</div>;
        if (this.props.waiting !== null && this.props.waiting.length !== 0) {
            visits = this.props.waiting.map(function(value, key) {
                return (<VisitorRow
                    key={value.id}
                    {...value}
                    clinician={this.props.clinician}
                    buttonClass={value.color}
                    select={this.props.select.bind(null, value)}/>);
            }.bind(this));
        }

        return (
            <div>
                <h3>Waiting</h3>
                {visits}
            </div>
        );

    },
});

var VisitorRow = React.createClass({
    getDefaultProps: function() {
        return {visitor: null, buttonClass: 'success', clinician: null, select: null,};
    },

    render: function() {
        let _className = 'btn btn-block btn-lg btn-' + this.props.buttonClass;
        let waiting = null;
        if (this.props.category == '1' || this.props.has_emergency == '1') {
            waiting = <span>&nbsp;- Waiting: {this.props.wait_time} min.</span>;
        }
        let preferredName = this.props.visitor.preferred_name !== null ? this.props.visitor.preferred_name : this.props.visitor.first_name;
        return (
            <button className={_className} onClick={this.props.select}>
                <CategoryIcon category={this.props.category} title={this.props.reason_title}/>
                &nbsp;<strong>{preferredName} {this.props.visitor.last_name}</strong>
                {waiting}
            </button>
        );
    },
});

var CategoryIcon = React.createClass({
    getDefaultProps: function() {
        return {category: 0, title: null,};
    },

    render: function() {
        var icon = null;
        var _className = 'category fa fa-lg ' + categoryIcons[this.props.category];
        icon = <i className={_className} title={this.props.title}></i>;
        return (
            <span>{icon}</span>
        );
    },
});
