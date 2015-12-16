var Dispositions = React.createClass({
    mixins: [FormMixin],

    getInitialState: function() {
        return {
            dispositions : null,
            saveFail: false,
            currentEdit: null,
            showForm: false,
            currentDisposition : null
        };
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

    setDispositions : function(value) {
        this.setState({dispositions:value});
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
            button = (
                <button className="btn btn-success" onClick={this.showForm} style={{marginBottom: '1em'}}>Add disposition&nbsp;
                    <i className="fa fa-caret-down"></i>
                </button>
            );
        }
        if (this.state.saveFail) {
            alert = (<div className="alert alert-danger">
                <strong>
                    <i className="fa fa-exclamation-triangle"></i>
                    Error:</strong>
                Disposition save failed</div>
            );
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
                <div>
                    <DispositionList dispositions={this.state.dispositions} reload={this.loadData}
                        currentEdit={this.state.currentEdit} setCurrentEdit={this.setCurrentEdit}
                        showForm={this.showForm} setCurrent={this.setCurrentEdit}
                        setDispositions={this.setDispositions}/>
                </div>
            </div>
        );
    }

});

var DispositionList = React.createClass({

    mixins : [sortable],

    getInitialState: function() {
        return {
            dispositions : null,
            editRow: null,
            fail: false
         };
    },

    getDefaultProps: function() {
        return {
            dispositions: null,
            reload : null,
            currentEdit : null,
            setCurrentEdit : null,
            setDispositions : null
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

    componentDidMount: function() {
        this.loadSortable('#disposition-listing');
    },

    updateSort : function(event, ui) {
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
        	command : 'sort',
            moved : movedId,
            next : nextRowId,
            prev : prevRowId
        }, null, 'json')
        	.done(function(data){
        	}.bind(this));
    },

    render: function() {
        var rows = null;
        var failure = null;
        if (this.props.dispositions !== null) {
            rows = this.props.dispositions.map(function(value, key) {
                if (this.state.editRow === key) {
                    return <DispositionEditRow key={value.id} {...value} cancel={this.cancel} reload={this.props.reload} fail={this.fail}/>
                } else {
                    return <DispositionListRow key={value.id} {...value} edit={this.edit.bind(null, key)} delete={this.delete}/>;
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
            <div id="sortBox">
                {failure}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody ref="sortRows">
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
            title: null,
            icon : 'fa-times',
            color : 'btn-danger',
            id:null,
            edit: null,
            sorting : null,
            delete: null
        };
    },

    deleteCheck : function() {
        if (window.confirm('Are you sure you want to remove this disposition?')) {
            this.props.delete(this.props.id);
        }
    },

    render: function() {
        var iconClass = 'fa fa-' + this.props.icon;
        var buttonClass = 'btn btn-block ' + this.props.color;

        return (
            <tr className="sorting-row" data-rowid={this.props.id} id={this.props.id}>
                <td className='col-xs-3'>
                    <button className="btn btn-default handle"><i className="fa fa-arrows"></i></button>&nbsp;
                    <button className="btn btn-primary btn-sm" onClick={this.props.edit} title="Edit disposition">
                        <i className="fa fa-edit"></i>
                    </button>&nbsp;
                    <button className="btn btn-danger btn-sm"
                        onClick={this.deleteCheck} title="Delete disposition">
                        <i className="fa fa-times"></i>
                    </button>
                </td>
                <td>
                    <button className={buttonClass}><i className={iconClass}></i>&nbsp;{this.props.title}</button>
                </td>
            </tr>
        );
    }

});

var DispositionForm = React.createClass({

    getInitialState: function() {
        return {
            title: null,
            color : null,
            icon : null,
            formError: ''
        };
    },

    getDefaultProps: function() {
        return {
            closeForm: null,
            reload: null,
            fail: null,
            title : null,
            color : null,
            icon : null,
            dispositionId : 0
        };
    },

    componentWillMount: function(prevProps, prevState) {
        this.setState({
            title : this.props.title,
            color : this.props.color,
            icon : this.props.icon,
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
            icon : this.state.icon,
            color : this.state.color
        }, null, 'json').done(function(data) {
            this.props.reload();
        }.bind(this)).fail(function() {
            this.props.fail();
        }.bind(this)).always(function() {
            this.props.closeForm();
        }.bind(this));

    },

    pickColor: function(color, event) {
        event.preventDefault();
        this.setState({
            color : color
        });
    },

    pickIcon: function(icon, event) {
        event.preventDefault();
        this.setState({
            icon : icon
        });
    },

    render: function() {
        var alert = null;
        if (this.state.formError.length > 0) {
            alert = <div className="alert alert-danger" style={{fontSize: '1em'}}>
                {this.state.formError}</div>;
        }

        return (
            <div className="disposition-form">
                {alert}
                <CurrentIcon icon={this.state.icon} color={this.state.color} title={this.state.title}/>
                <form method="post" action="counseling/Admin/Settings/Disposition">
                    <input type="hidden" name="command" value="add"/>
                    <TextInput inputId="title" label="Disposition title"
                        handleChange={this.updateTitle} required={true}
                        tabIndex={1} value={this.state.title}/>
                    <label>Button color</label>
                    <DispositionColor handleClick={this.pickColor}/>
                    <label>Icon</label>
                    <DispositionIcons handleClick={this.pickIcon}/>
                    <hr />
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

var DispositionColor = React.createClass({
    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        return (
            <div>
                <button className="btn btn-default" onClick={this.props.handleClick.bind(null, 'btn-default')}>&nbsp;</button>&nbsp;
                <button className="btn btn-primary" onClick={this.props.handleClick.bind(null, 'btn-primary')}>&nbsp;</button>&nbsp;
                <button className="btn btn-success" onClick={this.props.handleClick.bind(null, 'btn-success')}>&nbsp;</button>&nbsp;
                <button className="btn btn-info" onClick={this.props.handleClick.bind(null, 'btn-info')}>&nbsp;</button>&nbsp;
                <button className="btn btn-warning" onClick={this.props.handleClick.bind(null, 'btn-warning')}>&nbsp;</button>&nbsp;
                <button className="btn btn-danger" onClick={this.props.handleClick.bind(null, 'btn-danger')}>&nbsp;</button>
            </div>
        );
    }

});

var CurrentIcon = React.createClass({
    getDefaultProps: function() {
        return {
            color : null,
            icon : null,
            title : ''
        };
    },

    render: function() {
        var buttonClass = 'btn btn-block btn-lg ' + this.props.color;
        var iconClass = 'fa fa-' + this.props.icon;
        var title = (this.props.title === null || this.props.title.length === 0) ? 'Sample' : this.props.title;

        return (
            <div className="text-center">
                <button className={buttonClass}><i className={iconClass}></i> {title}</button>
            </div>
        );
    }

});

var DispositionIcons = React.createClass({

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        return (
            <div>
                <table className="table">
                    <tbody>
                        <tr>
                            <td><IconButton label="archive" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="automobile" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="balance-scale" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="ban" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="bank" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="bed" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="bell" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="binoculars" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="book" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="briefcase" handleClick={this.props.handleClick}/></td>
                        </tr>
                        <tr>
                            <td><IconButton label="building" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="bullhorn" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="camera" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="coffee" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="cog" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="comment" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="envelope" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="exclamation-circle" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="eye" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="flag" handleClick={this.props.handleClick}/></td>
                        </tr>
                        <tr>
                            <td><IconButton label="flask" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="folder-o" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="gavel" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="globe" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="users" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="heart" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="home" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="hourglass-1" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="calendar" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="life-ring" handleClick={this.props.handleClick}/></td>
                        </tr>
                        <tr>
                            <td><IconButton label="lightbulb-o" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="male" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="female" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="map-o" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="microphone" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="money" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="music" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="paint-brush" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="pencil" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="phone" handleClick={this.props.handleClick}/></td>
                        </tr>
                        <tr>
                            <td><IconButton label="plug" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="print" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="puzzle-piece" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="trophy" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="umbrella" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="user-plus" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="warning" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="wrench" handleClick={this.props.handleClick}/></td>
                            <td><IconButton label="comments-o" handleClick={this.props.handleClick}/></td>
                            <td>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

});

var IconButton = React.createClass({
    getDefaultProps: function() {
        return {
            label : null,
            handleClick : null
        };
    },

    render: function() {
        var iconClassName = 'fa fa-' + this.props.label;
        return (
            <button className="btn btn-default" onClick={this.props.handleClick.bind(null, this.props.label)}><i className={iconClassName}></i></button>
        );
    }

});

var DispositionEditRow = React.createClass({
    componentDidMount: function() {
        $('.form-anchor')[0].scrollIntoView({behavior : 'smooth'});
    },

    getDefaultProps: function() {
        return {
            title : null,
            color : null,
            icon : null,
            cancel : null,
            reload : null
        };
    },

    render: function() {
        return (
            <tr>
                <td colSpan="2">
                    <div className="form-anchor"></div>
                    <div className="active-form">
                        <DispositionForm
                            closeForm={this.props.cancel}
                            reload={this.props.reload}
                            fail={this.props.fail}
                            title={this.props.title}
                            icon={this.props.icon}
                            color={this.props.color}
                            dispositionId={this.props.id}
                            />
                    </div>
                </td>
            </tr>
        );
    }
});
