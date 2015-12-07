var Clinicians = React.createClass({
    mixins: [FormMixin],

    getInitialState: function() {
        return {
            showForm: false,
            clinicians: null,
            saveFail: false,
            currentEdit: null
        };
    },

    loadData: function() {
        $.getJSON('counseling/Admin/Settings/Clinician', {
            command: 'list'
        }).done(function(data) {
            this.setState({clinicians: data});
        }.bind(this));
    },

    setCurrentEdit: function(value) {
        this.setState({currentEdit: value});
    },

    render: function() {
        var form = null;
        var button = null;

        if (this.state.showForm) {
            form = (
                <div className="form-box">
                    <ClinicianForm closeForm={this.closeForm} reload={this.loadData}
                        fail={this.saveFailure}/>
                </div>
            );
        } else {
            button = <button className="btn btn-success" onClick={this.showForm}
                style={{marginBottom: '1em'}}>Add clinician&nbsp;
                <i className="fa fa-caret-down"></i>
            </button>;
        }
        if (this.state.saveFail) {
            alert = <div className="alert alert-danger">
                <strong>
                    <i className="fa fa-exclamation-triangle"></i>
                    Error:</strong>
                Clinician save failed</div>;
        }
        return (
            <div>
                <div className="clinician-form-area">
                    <div style={{position: 'relative'}}>
                        {form}
                    </div>
                    <div style={{height:'50px'}}>
                        {button}
                    </div>
                </div>
                {alert}
                <div className="clinician-listing">
                    <ClinicianList clinicians={this.state.clinicians} reload={this.loadData}
                        currentEdit={this.state.currentEdit} setCurrentEdit={this.setCurrentEdit}/>
                </div>
            </div>
        );
    }

});

var ClinicianForm = React.createClass({
    getInitialState: function() {
        return {firstName: null, lastName: null, formError: ''};
    },

    getDefaultProps: function() {
        return {
            closeForm: null,
            reload: null,
            fail: null,
            firstName : null,
            lastName : null,
            clinicianId : 0
        };
    },

    componentWillMount: function(prevProps, prevState) {
        this.setState({
            firstName : this.props.firstName,
            lastName : this.props.lastName,
            clinicianId : this.props.clinicianId
        });
    },

    componentDidMount: function() {
        $('#firstName').focus();
    },

    closeForm: function(event) {
        event.preventDefault();
        this.props.closeForm();
    },

    updateFirstName: function(event) {
        this.setState({firstName: event.target.value});
    },

    updateLastName: function(event) {
        this.setState({lastName: event.target.value});
    },

    save: function(event) {
        event.preventDefault();

        if (this.state.firstName === null || this.state.firstName.length === 0) {
            $('#firstName').css('borderColor', 'red');
            this.setState({formError: 'First name empty'});
            return;
        }
        if (this.state.lastName === null || this.state.lastName.length === 0) {
            var splitString = this.state.firstName.split(' ');
            console.log(splitString);
            if (splitString.length === 2) {
                this.setState({
                    firstName : splitString[0],
                    lastName : splitString[1],
                    formError: 'Last name empty. Did you type the full name in the first name field?'
                });
                return;
            }

            $('#lastName').css('borderColor', 'red');
            this.setState({formError: 'Last name empty.'});
            return;
        }

        this.setState({formError: false});
        $.post('counseling/Admin/Settings/Clinician', {
            command: 'save',
            clinicianId: this.state.clinicianId,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }, null, 'json').done(function(data) {
            this.props.reload();
        }.bind(this)).fail(function() {
            this.props.fail();
        }.bind(this)).always(function() {
            this.props.closeForm();
        }.bind(this));

    },

    render: function() {
        var alert = null;
        if (this.state.formError.length > 0) {
            alert = <div className="alert alert-danger" style={{fontSize: '1em'}}>
                {this.state.formError}</div>;
        }

        return (
            <div>
                {alert}
                <div className="row">
                    <form method="post" action="counseling/Admin/Settings/Clinicians">
                        <input type="hidden" name="command" value="add"/>
                        <div className="col-sm-6">
                            <TextInput inputId="firstName" label="First name"
                                handleChange={this.updateFirstName} required={true}
                                tabIndex={1} value={this.state.firstName}/>
                            <button className="pull-left btn btn-primary" onClick={this.save} tabIndex={2}>
                                <i className="fa fa-check"></i>
                                Save Clinician</button>&nbsp;
                            <button className="btn btn-danger" onClick={this.closeForm} tabIndex={3}>
                                <i className="fa fa-exclamation-triangle"></i>
                                Cancel</button>
                        </div>
                        <div className="col-sm-6">
                            <TextInput inputId="lastName" label="Last name"
                                handleChange={this.updateLastName} required={true}
                                tabIndex={1} value={this.state.lastName}/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

});

var ClinicianList = React.createClass({
    getInitialState: function() {
        return {
            editRow: null,
            fail: false
         };
    },

    getDefaultProps: function() {
        return {
            clinicians: null,
            reload : null,
            currentEdit : null,
            setCurrentEdit : null
        };
    },

    edit: function(key) {
        this.setState({editRow: key});
    },

    delete: function(cid) {
        $.post('counseling/Admin/Settings/Clinician', {
        	command : 'delete',
            clinicianId : cid
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    cancel: function() {
        this.setState({editRow: null});
    },

    fail : function () {
        this.setState({
            fail : true
        });
    },

    render: function() {
        var rows = null;
        var failure = null;

        if (this.props.clinicians !== null) {
            rows = this.props.clinicians.map(function(value, key) {
                if (this.state.editRow === key) {
                    return <ClinicianEditRow key={key} {...value} cancel={this.cancel} reload={this.props.reload} fail={this.fail}/>
                } else {
                    return <ClinicianListRow key={key} {...value} edit={this.edit.bind(null, key)}
                        delete={this.delete}/>;
                }
            }.bind(this));
        }

        if (this.state.fail) {
            failure = (
                <div className="alert alert-danger">
                    <i className="fa fa-exclamation-triangle"></i>&nbsp;
                    Failed to update clinician
                </div>
            );
        }
        return (
            <div>
                {failure}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Name</th>
                            <th>Total visitors seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});

var ClinicianListRow = React.createClass({
    getDefaultProps: function() {
        return {
            first_name: null,
            last_name: null,
            id:null,
            edit: null,
            delete: null
        };
    },

    render: function() {
        return (
            <tr>
                <td className='col-sm-2'>
                    <button className="btn btn-primary btn-sm" onClick={this.props.edit} title="Edit clinician">
                        <i className="fa fa-edit"></i>
                    </button>&nbsp;
                    <button className="btn btn-danger btn-sm"
                        onClick={this.props.delete.bind(null, this.props.id)} title="Delete clinician">
                        <i className="fa fa-times"></i>
                    </button>
                </td>
                <td>
                    {this.props.first_name}&nbsp;
                    {this.props.last_name}
                </td>
                <td>{this.props.visitors_seen}</td>
            </tr>
        );
    }

});

var ClinicianEditRow = React.createClass({
    getDefaultProps: function() {
        return {
            first_name : null,
            last_name : null,
            cancel : null,
            reload : null
        };
    },

    render: function() {
        return (
            <tr>
                <td colSpan="2">
                    <ClinicianForm
                        closeForm={this.props.cancel}
                        reload={this.props.reload}
                        fail={this.props.fail}
                        firstName={this.props.first_name}
                        lastName={this.props.last_name}
                        clinicianId={this.props.id}
                        />
                </td>
            </tr>
        );
    }

});
