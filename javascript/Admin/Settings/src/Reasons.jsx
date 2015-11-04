var Reasons = React.createClass({
    getInitialState: function() {
        return {
            showForm : false,
            reasons : null,
            saveFail : false,
            currentEdit : null
        };
    },

    componentDidMount : function() {
        this.loadReasons();
    },

    loadReasons : function()
    {
        $.getJSON('counseling/Admin/Settings/Reason', {
        	command : 'list'
        }).done(function(data){
            this.setState({
                reasons : data,
            });
        }.bind(this));
    },

    closeForm : function()
    {
        this.setState({
            showForm : false
        });
    },

    showForm : function()
    {
        this.setState({
            showForm : true
        });
    },

    saveFailure : function()
    {
        this.setState({
            saveFail : true
        });
    },

    setCurrentEdit : function(reasonId, section)
    {
        var currentEdit = null;
        if (reasonId !== null) {
            currentEdit = {id : reasonId, section : section};
        }
        this.setState({
            currentEdit : currentEdit
        });
    },

    render: function() {
        var form = null;
        var button = null;
        var alert = null;
        var reasons = null;

        if (this.state.showForm) {
            form = <ReasonForm closeForm={this.closeForm} reload={this.loadReasons} fail={this.saveFailure}/>;
        } else {
            button = <button className="btn btn-success" onClick={this.showForm} style={{marginBottom:'1em'}}>Add reason <i className="fa fa-caret-down"></i></button>;
        }
        if (this.state.saveFail) {
            alert = <div className="alert alert-danger"><strong><i className="fa fa-exclamation-triangle"></i> Error:</strong> Reason save failed</div>;
        }

        return (
            <div>
                <div className="settings-form-area">
                    <div style={{position: 'relative'}}>
                        {form}
                    </div>
                    {button}
                </div>
                {alert}
                <div className="settings-listing">
                    <ReasonList reasons={this.state.reasons} reload={this.loadReasons} currentEdit={this.state.currentEdit} setCurrentEdit={this.setCurrentEdit}/>
                </div>
            </div>
        );
    }
});

var ReasonList = React.createClass({
    getInitialState: function() {
        return {
            editTitle : false,
            editDescription : false,
            editInstruction : false,
            title : null,
            description : null,
            instruction : null,
            currentEdit : null,
            setCurrentEdit : null
        };
    },

    getDefaultProps: function() {
        return {
            reasons : null
        };
    },

    flipEmergency : function(i, event)
    {
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'flipEmergency',
            reasonId : this.props.reasons[i].id,
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    flipAdminMenuShow : function (i, event)
    {
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'flipAdminMenuShow',
            reasonId : this.props.reasons[i].id,
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    flipWaitListed : function (i, event)
    {
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'flipWaitListed',
            reasonId : this.props.reasons[i].id,
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    flipAskForPhone : function (i, event)
    {
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'flipAskForPhone',
            reasonId : this.props.reasons[i].id,
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    render: function() {
        var reasons = null;
        var emergency = null;
        var wait = null;
        var show = null;
        var phone = null;
        var title = null;
        var instruction = null;

        var props = {};
        props.reload = this.props.reload;
        props.currentEdit = this.props.currentEdit;
        props.setCurrentEdit = this.props.setCurrentEdit;

        if (this.props.reasons) {
            reasons = this.props.reasons.map(function(value, key){
                emergency = <FlipOption handleClick={this.flipEmergency.bind(this,key)}
                    active={value.show_emergency == '1'}
                    title="Reason ask visitor if they have an emergency"
                    label="Emergency" icon="fa-exclamation-triangle" />;

                show = <FlipOption handleClick={this.flipAdminMenuShow.bind(this,key)}
                    active={value.admin_menu_show == '1'}
                    title="Reason will show a tally on the admin screen"
                    label="Tally" icon="fa-eye" />;

                wait = <FlipOption handleClick={this.flipWaitListed.bind(this,key)}
                    active={value.wait_listed == '1'}
                    title="Choosing this reason puts visitor in wait queue"
                    label="Waiting" icon="fa-hourglass-start" />;

                phone = <FlipOption handleClick={this.flipAskForPhone.bind(this,key)}
                    active={value.ask_for_phone == '1'}
                    title="Choosing this asks for the visitor's phone number"
                    label="Phone number" icon="fa-phone" />;

                props.reasonId = value.id;
                return (
                    <div className="panel panel-default" key={key}>
                        <div className="panel-heading">
                            <span className="badge">{value.ordering}</span>
                        </div>
                        <div className="panel-body">
                            <div>
                                <strong>Title:</strong>
                                <ReasonTitle value={value.title} {...props} />
                            </div>
                            <div>
                                <strong>Description:</strong>
                                <ReasonDescription value={value.description} {...props}/>
                            </div>
                            <div>
                                <strong>Instruction:</strong>
                                <ReasonInstruction value={value.instruction} {...props}/>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    {emergency}
                                </div>
                                <div className="col-sm-3">
                                    {phone}
                                </div>
                                <div className="col-sm-3">
                                    {wait}
                                </div>
                                <div className="col-sm-3">
                                    {show}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }.bind(this));
        }
        return (
            <div>{reasons}</div>
        );
    }

});
var ReasonTitle = React.createClass({

    getDefaultProps: function() {
        return {
            value : null,
            reasonId : 0,
            reload : null,
            currentEdit : null,
            setCurrentEdit : null
        };
    },

    update : function(title) {
        if (title === null || title.length === 0) {
            return;
        }
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'setTitle',
            reasonId : this.props.reasonId,
            title : title
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    render: function() {
        return (
            <ReasonValue {...this.props}
                update={this.update}
                placeholder="One or two words describing reason. Internal use only."
                defaultValue={this.props.value}
                currentEdit={this.props.currentEdit}
                setCurrentEdit={this.props.setCurrentEdit}
                section="1"
                />
        );
    }

});

var ReasonInstruction = React.createClass({
    getInitialState: function() {
        return {
            editMode : false,
            instruction : '1'
        };
    },

    getDefaultProps: function() {
        return {
            value : '1',
            editMode : false,
            reasonId : 0,
            content : null
        };
    },

    componentDidMount : function() {
        this.setState({
            editMode : this.props.editMode,
            instruction : this.props.value
        });
    },

    formMode : function() {
        this.props.setCurrentEdit(this.props.reasonId, this.props.section);
        this.setState({
            editMode : true
        });
    },

    saveInstruction : function() {
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'setInstruction',
            reasonId : this.props.reasonId,
            instruction : this.state.instruction
        }, null, 'json')
        	.done(function(data){
                this.setState({
                    editMode : false
                });
                this.props.reload();
        	}.bind(this));
    },

    updateInstruction : function(e) {
        this.setState({
            instruction : e.target.value
        });
    },

    closeForm : function() {
        this.setState({
            editMode : false
        });
    },

    render: function() {
        var value = null;
        var option = null;
        if (this.state.instruction === '1') {
            option = 'Sit down';
        } else {
            option = 'See the front desk';
        }

        if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == this.props.section) {
            value = (
                <div className="row">
                    <div className="col-sm-3">
                        <ReasonInstructionSelect value={this.state.instruction} handleChange={this.updateInstruction}/>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-success" onClick={this.saveInstruction}><i className="fa fa-check"></i></button>
                        <button className="btn btn-danger" onClick={this.closeForm}><i className="fa fa-times"></i></button>
                    </div>
                </div>
            );
        } else {
            value = <div className="pointer" onClick={this.formMode} title="Click to edit">{option}</div>;
        }

        return (
            <div>{value}</div>
        )
    }

});

var ReasonInstructionSelect = React.createClass({
    getDefaultProps: function() {
        return {
            value : '1'
        };
    },

    render: function() {
        return (
            <select ref="instructionSelect" defaultValue={this.props.value} className="form-control" onChange={this.props.handleChange}>
                <option value="1">Sit down</option>
                <option value="2">See front desk</option>
            </select>
        );
    }

});

var ReasonDescription = React.createClass({

    getDefaultProps: function() {
        return {
            value : null,
            reasonId : 0,
            currentEdit : null,
            setCurrentEdit : null
        };
    },

    update : function(description) {
        if (description=== null || description.length === 0) {
            return;
        }
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'setDescription',
            reasonId : this.props.reasonId,
            description : description
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this));
    },

    render: function() {
        return (
            <ReasonValue
                {...this.props}
                update={this.update}
                placeholder="Description of reason. Seen by visitors."
                defaultValue={this.props.value}
                section="2"
                />
        );
    }

});


var ReasonValue = React.createClass({
    getInitialState: function() {
        return {
            value : null,
            editMode : false
        };
    },

    getDefaultProps: function() {
        return {
            currentEdit : null,
            setCurrentEdit : null,
            placeholder : null,
            defaultValue : null,
            update : null,
            section : 0,
            reasonId : 0
        };
    },

    updateValue : function(e) {
        this.setState({
            value : e.target.value
        });
    },

    closeInput : function() {
        this.setState({
            editMode : false
        });
    },

    openInput : function() {
        this.props.setCurrentEdit(this.props.reasonId, this.props.section);
        this.setState({
            editMode : true
        });
    },

    sendUpdate: function() {
        this.props.update(this.state.value);
        this.closeInput();
    },

    render: function() {
        console.log(this.props.currentEdit);
        if (this.state.editMode && this.props.currentEdit.id == this.props.reasonId && this.props.currentEdit.section == this.props.section) {
            value = (
                <LineEdit
                    placeholder={this.props.placeholder}
                    handleChange={this.updateValue}
                    defaultValue={this.props.defaultValue}
                    value={this.state.value}
                    close={this.closeInput}
                    update={this.sendUpdate}
                />
            );
        } else {
            value = (
                <div className="editItem" onClick={this.openInput} title="Click to edit">{this.props.defaultValue}</div>
            );
        }

        return (
            <div>{value}</div>
        );
    }

});


var LineEdit = React.createClass({
    getDefaultProps: function() {
        return {
            placeholder : null,
            handleChange : null,
            defaultValue : null,
            close : null,
            update : null
        };
    },

    render: function() {
        return (
            <div className="input-group">
                <input className="editItem form-control" placeholder={this.props.placeholder} onChange={this.props.handleChange} defaultValue={this.props.defaultValue}/>
                <span className="input-group-btn">
                    <button className="btn btn-success" onClick={this.props.update}><i className="fa fa-check"></i></button>
                    <button className="btn btn-danger" onClick={this.props.close}><i className="fa fa-times"></i></button>
                </span>
            </div>
        );
    }

});

var FlipOption = React.createClass({
    getDefaultProps: function() {
        return {
            handleClick : null,
            active : false,
            title : null,
            label : null,
            icon : null
        };
    },

    render: function() {
        var divClass = 'pointer';
        var iconClass = 'fa fa-lg ' + this.props.icon;

        if (this.props.active) {
            divClass += ' text-success'
        } else {
            divClass += ' dim'
        }
        return (
            <div onClick={this.props.handleClick} className={divClass}><i className={iconClass} title={this.props.title}></i> {this.props.label}</div>
        );
    }

});


var ReasonForm = React.createClass({
    getInitialState: function() {
        return {
            title : null,
            description : null,
            instruction : 1,
            icon : null,
            showEmergency : 0,
            adminMenuShow : 0,
            askForPhone : 0,
            waitListed : 0,
            formError : false,
            instructionList : null
        };
    },

    getDefaultProps: function() {
        return {
            closeForm : null,
            reload : null,
            fail : null
        };
    },

    componentDidMount: function() {
        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        });
    },

    save: function(event) {
        event.preventDefault();
        if (this.state.title === null || this.state.title.length === 0) {
            $('#title').css('borderColor', 'red');
            this.setState({
                formError: true
            });
            return;
        }

        if (this.state.description === null || this.state.description.length === 0) {
            $('#description').css('borderColor', 'red');
            this.setState({
                formError: true
            });
            return;
        }

        this.setState({
            formError : false
        });
        $.post('counseling/Admin/Settings/Reason', {
        	command : 'save',
            reasonId : 0,
            title : this.state.title,
            description : this.state.description,
            instruction : this.state.instruction,
            icon : this.state.icon,
            showEmergency : this.state.showEmergency,
            adminMenuShow : this.state.adminMenuShow,
            askForPhone : this.state.askForPhone,
            waitListed : this.state.waitListed
        }, null, 'json')
        	.done(function(data){
                this.props.reload();
        	}.bind(this))
            .fail(function(){
                this.props.fail();
            }.bind(this))
            .always(function(){
                this.props.closeForm();
            }.bind(this));
    },

    updateTitle : function(event) {
        this.setState({
            title : event.target.value}
        );
    },

    updateDescription : function(event) {
        this.setState({
            description : event.target.value
        });
    },

    updateInstruction : function(event) {
        this.setState({
            instruction : event.target.value
        });
    },

    updateEmergency : function(event) {
        this.setState({
            showEmergency: event.target.checked
        });
    },

    updateAdminMenu : function(event) {
        this.setState({
            adminMenuShow: event.target.checked
        });
    },

    updateAskForPhone : function(event) {
        this.setState({
            askForPhone: event.target.checked
        });
    },

    updateWaitListed : function(event) {
        this.setState({
            waitListed: event.target.checked
        });
    },

    closeForm : function(event)
    {
        event.preventDefault();
        this.props.closeForm();
    },

    render: function() {
        return (
            <div style={{position:'absolute', width : '600px', backgroundColor:'white', border : '1px solid black', padding:'1em', borderRadius : '10px', zIndex : '50'}}>
                <form method="post" action="counseling/Admin/Settings/Reasons">
                    <input type="hidden" name="command" value="add" />
                    {this.state.formError ? <div className="alert alert-danger" style={{fontSize : '1em'}}>Please complete all highlighted text inputs.</div> : null}
                    <div className="form-group">
                        <TextInput inputId="title" label="Title" placeholder="One or two words describing reason. Internal use only."
                            handleChange={this.updateTitle} required={true} tabIndex={1}/>
                    </div>
                    <div className="form-group">
                        <TextInput inputId="description" label="Description" placeholder="Description of reason. Seen by visitors."
                            handleChange={this.updateDescription} required={true} tabIndex={2}/>
                    </div>
                    <div className="form-group">
                            <label>Directions</label>
                            <p>
                                <label style={{marginRight:'2em'}}>
                                    <input type="radio" name="instruction" value="1" defaultChecked={true} tabIndex={3} onClick={this.updateInstruction}/> Sit down
                                </label>
                                <label>
                                    <input type="radio" name="instruction" value="2" tabIndex={4} onClick={this.updateInstruction}/> Front desk
                                </label>
                            </p>
                    </div>

                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="showEmergency" value="1" onChange={this.updateEmergency} tabIndex={5}/> Show emergency question
                                &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right"
                                title="If checked, the visitor will be asked if they have an emergency."></i>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="adminMenuShow" value="1" onChange={this.updateAdminMenu} tabIndex={6}/> Track on dashboards
                                &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right"
                                title="If checked, this reason will have a icon and tally on the dashboard."></i>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="waitListed" value="1"  onChange={this.updateWaitListed} tabIndex={7}/> Put on wait list
                                &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right"
                                title="If checked, the visitor will be placed on the waiting list."></i>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="askForPhone" value="1"  onChange={this.updateAskForPhone} tabIndex={8}/> Ask for phone number
                                &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right"
                                title="If checked, the visitor will be asked for their phone number."></i>
                        </label>
                    </div>
                    <button className="pull-left btn btn-primary" onClick={this.save} tabIndex={8}><i className="fa fa-check"></i> Save reason</button>&nbsp;
                    <button className="btn btn-danger" onClick={this.closeForm} tabIndex={9}><i className="fa fa-times"></i> Cancel</button>
                </form>
            </div>
        );
    }

});

var IconTable = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        return (
            <table className="table">
                <tbody>
                <tr>
                    <td><i className="fa fa-hand-paper-o"></i></td>
                    <td><i className="fa fa-calendar"></i></td>
                    <td><i className="fa fa-map-o"></i></td>
                    <td><i className="fa fa-book"></i></td>
                    <td><i className="fa fa-check-square-o"></i></td>
                </tr>
                <tr>
                    <td><i className="fa fa-clock-o"></i></td>
                    <td><i className="fa fa-comment-o"></i></td>
                    <td><i className="fa fa-frown-o"></i></td>
                    <td><i className="fa fa-smile-o"></i></td>
                    <td><i className="fa fa-users"></i></td>
                </tr>
                <tr>
                    <td><i className="fa fa-user"></i></td>
                    <td><i className="fa fa-home"></i></td>
                    <td><i className="fa fa-phone"></i></td>
                    <td><i className="fa fa-question"></i></td>
                    <td><i className="fa fa-star"></i></td>
                </tr>
                <tr>
                    <td><i className="fa fa-thumbs-o-up"></i></td>
                    <td><i className="fa fa-thumbs-o-down"></i></td>
                    <td><i className="fa fa-warning"></i></td>
                    <td><i className="fa fa-gear"></i></td>
                    <td>&nbsp;</td>
                </tr>
                </tbody>
            </table>
        );
    }

});
