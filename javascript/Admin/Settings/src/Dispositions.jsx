var Dispositions = React.createClass({
    mixins: [FormMixin],

    getInitialState: function() {
        return {
            dispositions : null,
            saveFail: false,
            currentEdit: null,
            showForm: false
        };
    },

    componentDidMount: function() {
        this.loadData();
    },

    loadData : function() {
        $.getJSON('counseling/Admin/Settings/Disposition', {
        	command : 'list'
        }).done(function(data){
            this.setState({
                dispositions : data
            });
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
                    <DispositionForm closeForm={this.closeForm} reload={this.loadData}
                        fail={this.saveFailure}/>
                </div>
            );
        } else {
            button = <button className="btn btn-success" onClick={this.showForm}
                style={{marginBottom: '1em'}}>Add disposition&nbsp;
                <i className="fa fa-caret-down"></i>
            </button>;
        }
        if (this.state.saveFail) {
            alert = <div className="alert alert-danger">
                <strong>
                    <i className="fa fa-exclamation-triangle"></i>
                    Error:</strong>
                Disposition save failed</div>;
        }
        return (
            <div>
                <div className="disposition-form-area">
                    <div style={{position: 'relative'}}>
                        {form}
                    </div>
                    <div style={{height:'50px'}}>
                        {button}
                    </div>
                </div>
                {alert}
                <div className="disposition-listing">
                    <DispositionList dispositions={this.state.dispositions} reload={this.loadData}
                        currentEdit={this.state.currentEdit} setCurrentEdit={this.setCurrentEdit}/>
                </div>
            </div>
        );
    }

});

var DispositionList = React.createClass({
    getInitialState: function() {
        return {
            editRow: null,
            fail: false
         };
    },

    getDefaultProps: function() {
        return {
            dispositions: null,
            reload : null,
            currentEdit : null,
            setCurrentEdit : null
        };
    },

    edit: function(key) {
        this.setState({editRow: key});
    },

    delete: function(did) {
        $.post('counseling/Admin/Settings/Disposition', {
        	command : 'delete',
            dispositionId : did
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

        if (this.props.dispositions !== null) {
            rows = this.props.dispositions.map(function(value, key) {
                if (this.state.editRow === key) {
                    return <DispositionEditRow key={key} {...value} cancel={this.cancel} reload={this.props.reload} fail={this.fail}/>
                } else {
                    return <DispositionListRow key={key} {...value} edit={this.edit.bind(null, key)}
                        delete={this.delete}/>;
                }
            }.bind(this));
        }

        if (this.state.fail) {
            failure = (
                <div className="alert alert-danger">
                    <i className="fa fa-exclamation-triangle"></i>&nbsp;
                    Failed to update disposition
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

var DispositionListRow = React.createClass({
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
                    <button className="btn btn-primary btn-sm" onClick={this.props.edit} title="Edit disposition">
                        <i className="fa fa-edit"></i>
                    </button>&nbsp;
                    <button className="btn btn-danger btn-sm"
                        onClick={this.props.delete.bind(null, this.props.id)} title="Delete disposition">
                        <i className="fa fa-times"></i>
                    </button>
                </td>
                <td>
                    {this.props.title}
                </td>
            </tr>
        );
    }

});

var DispositionForm = React.createClass({
    getInitialState: function() {
        return {title: null, formError: ''};
    },

    getDefaultProps: function() {
        return {
            closeForm: null,
            reload: null,
            fail: null,
            title : null,
            dispositionId : 0
        };
    },

    componentWillMount: function(prevProps, prevState) {
        this.setState({
            title : this.props.title,
            dispositionId : this.props.dispositionId
        });
    },

    componentDidMount: function() {
        $('#title').focus();
    },

    closeForm: function(event) {
        event.preventDefault();
        this.props.closeForm();
    },

    updateTitle: function(event) {
        this.setState({title: event.target.value});
    },

    save: function(event) {
        event.preventDefault();

        if (this.state.title === null || this.state.title.length === 0) {
            $('#title').css('borderColor', 'red');
            this.setState({formError: 'Title empty'});
            return;
        }

        this.setState({formError: false});
        $.post('counseling/Admin/Settings/Disposition', {
            command: 'save',
            dispositionId: this.state.dispositionId,
            title: this.state.title,
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
                <form method="post" action="counseling/Admin/Settings/Disposition">
                    <input type="hidden" name="command" value="add"/>
                    <TextInput inputId="title" label="Disposition title"
                        handleChange={this.updateTitle} required={true}
                        tabIndex={1} value={this.state.title}/>
                    <button className="pull-left btn btn-primary" onClick={this.save} tabIndex={2}>
                        <i className="fa fa-check"></i>
                        Save Disposition</button>&nbsp;
                    <button className="btn btn-danger" onClick={this.closeForm} tabIndex={3}>
                        <i className="fa fa-exclamation-triangle"></i>
                        Cancel</button>
                </form>
            </div>
        );
    }
});



var DispositionEditRow = React.createClass({
    getDefaultProps: function() {
        return {
            title : null,
            cancel : null,
            reload : null
        };
    },

    render: function() {
        return (
            <tr>
                <td colSpan="2">
                    <DispositionForm
                        closeForm={this.props.cancel}
                        reload={this.props.reload}
                        fail={this.props.fail}
                        title={this.props.title}
                        dispositionId={this.props.id}
                        />
                </td>
            </tr>
        );
    }

});
