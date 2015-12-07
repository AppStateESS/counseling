var SelectVisitor = React.createClass({
    getInitialState: function() {
        return {
            waiting : null,
            emergencies : null,
        };
    },

    getDefaultProps: function() {
        return {
            clinician : null
        };
    },

    componentDidMount: function() {
        this.loadData();
    },

    loadData : function() {
        $.getJSON('counseling/Admin/Clinician', {
        	command : 'visitorList'
        }).done(function(data){
            if (data !== null) {
                this.setState({
                    waiting : data.waiting,
                    emergencies : data.emergencies
                });
            }
        }.bind(this));
    },


    goBack: function() {
        this.props.setStage('choose');
    },

    render: function() {
        var listing = null;
        if (this.state.waiting === null && this.state.emergencies === null) {
            listing = (
                <div className="alert alert-info">No visitors are currently waiting.</div>
            );
        } else {
            listing = <SelectVisitorListing waiting={this.state.waiting} emergencies={this.state.emergencies}
                setStage={this.props.setStage} clinician={this.props.clinician} reload={this.loadData} goBack={this.goBack}/>;
        }
        return (
            <div>
                <h2>Hello {this.props.clinician.first_name}</h2>
                {listing}
            </div>
        );
    }
});

var SelectVisitorListing = React.createClass({
    getDefaultProps: function() {
        return {
            waiting : null,
            emergencies : null
        };
    },


    complete: function() {
        this.props.setStage('reset');
    },

    render: function() {
        return (
            <div className='visitor-listing'>
                <Emergencies list={this.props.emergencies} clinician={this.props.clinician} complete={this.complete}/>
                <Waiting list={this.props.waiting} clinician={this.props.clinician} complete={this.complete}/>
                <div className="go-back text-center">
                    <button className="btn btn-default btn-lg" onClick={this.props.goBack}><i className="fa fa-undo"></i> Go Back</button>
                </div>
            </div>
        );
    }
});

var Emergencies = React.createClass({
    getDefaultProps: function() {
        return {
            list : null,
            clinician : null
        };
    },

    render: function() {
        if (this.props.list === null || this.props.list.length === 0) {
            return null;
        } else {
            var visits = this.props.list.map(function(value,key){
                return (<VisitorRow key={key} {...value} clinician={this.props.clinician} buttonClass="danger" complete={this.props.complete}/>);
            }.bind(this));

            return (
                <div>
                    <h3>Emergencies</h3>
                    {visits}
                </div>
            );
        }
    }
});

var Waiting = React.createClass({
    getDefaultProps: function() {
        return {
            list: null,
            clinician : null
        };
    },

    render: function() {
        if (this.props.list === null || this.props.list.length === 0) {
            return null;
        } else {
            var visits = this.props.list.map(function(value,key){
                return (<VisitorRow key={key} {...value} clinician={this.props.clinician} buttonClass="success" complete={this.props.complete}/>);
            }.bind(this));

            return (
                <div>
                    <h3>Waiting</h3>
                    {visits}
                </div>
            );
        }
    }
});

var VisitorRow = React.createClass({
    getDefaultProps: function() {
        return {
            visitor : null,
            buttonClass : 'success',
            complete : null
        };
    },

    select : function() {
        var visitId = this.props.id;
        var clinicianId = this.props.clinician.id;
        $.post('counseling/Admin/Clinician/', {
        	command : 'selectVisit',
            visitId : visitId,
            clinicianId : clinicianId
        }, null, 'json')
        	.done(function(data){
                this.props.complete();
        	}.bind(this));
    },

    render: function() {
        var _className = 'btn btn-block btn-lg btn-' + this.props.buttonClass;
        return (
            <button className={_className} onClick={this.select}>
                <CategoryIcon category={this.props.category} title={this.props.reason_title} />
                &nbsp;<strong>{this.props.visitor.first_name} {this.props.visitor.last_name}</strong>
                &nbsp;- Waiting: {this.props.wait_time} min.
            </button>
        );
    }

});

var CategoryIcon = React.createClass({
    getDefaultProps: function() {
        return {
            category : 0,
            title : null
        };
    },

    render: function() {
        var icon = null;
        var _className = 'category fa fa-lg ' + categoryIcons[this.props.category];
        icon = <i className={_className} title={this.props.title}></i>;
        return (
            <span>{icon}</span>
        );
    }
});
