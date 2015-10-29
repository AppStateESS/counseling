var Reasons = React.createClass({
    getInitialState: function() {
        return {
            showForm : false,
            reasons : null,
            saveFail : false
        };
    },

    getDefaultProps: function() {
        return {
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
                reasons : data
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

    render: function() {
        var form = null;
        var button = null;
        var alert = null;
        var reasons = null;

        if (this.state.showForm) {
            form = <ReasonForm closeForm={this.closeForm} reload={this.loadReasons} fail={this.saveFailure}/>;
        } else {
            button = <button className="btn btn-success" onClick={this.showForm}>Add reason <i className="fa fa-caret-down"></i></button>;
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
                    <ReasonList reasons={this.state.reasons} reload={this.loadReasons}/>
                </div>
            </div>
        );
    }
});

var ReasonList = React.createClass({
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

    render: function() {
        // BoolIcon is in Settings/Dashboard.jsx
        var reasons = null;
        if (this.props.reasons) {
            reasons = this.props.reasons.map(function(value, key){
                return (
                    <tr key={key}>
                        <td className="col-sm-1">{value.ordering}</td>
                        <td>{value.title}</td>
                        <td className="col-sm-2"><BoolIcon bool={value.flag_emergency} handleClick={this.flipEmergency.bind(this,key)}/></td>
                        <td className="col-sm-2"><BoolIcon bool={value.admin_menu_show} handleClick={this.flipAdminMenuShow.bind(this,key)}/></td>
                        <td className="col-sm-2"><BoolIcon bool={value.wait_listed} handleClick={this.flipWaitListed.bind(this,key)}/></td>
                    </tr>
                );
            }.bind(this));
        }
        return (
            <table className="table table-striped sans">
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Emergency</th>
                        <th>Admin menu</th>
                        <th>Wait list</th>
                    </tr>
                    {reasons}
                </tbody>
            </table>
        );
    }

});

var ReasonForm = React.createClass({
    getInitialState: function() {
        return {
            title : null,
            description : null,
            instruction : null,
            icon : null,
            flagEmergency : 0,
            adminMenuShow : 0,
            waitListed : 0,
            formError : false
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
        })
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

        if (this.state.instruction === null || this.state.instruction.length === 0) {
            $('#instruction').css('borderColor', 'red');
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
            flagEmergency : this.state.flagEmergency,
            adminMenuShow : this.state.adminMenuShow,
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
        this.setState({title : event.target.value});
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
            flagEmergency: event.target.checked
        });
    },

    updateAdminMenu : function(event) {
        this.setState({
            adminMenuShow: event.target.checked
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
            <div style={{position:'absolute', width:'100%', backgroundColor:'white', border : '1px solid black', padding:'1em', borderRadius : '10px'}}>
                <form method="post" action="counseling/Admin/Settings/Reasons">
                    <input type="hidden" name="command" value="add" />
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <TextInput inputId="title" label="Title" placeholder="One or two words describing reason. Internal use only."
                                    handleChange={this.updateTitle} required={true}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <TextInput inputId="description" label="Description" placeholder="Description of reason. Seen by visitors."
                                    handleChange={this.updateDescription} required={true}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <TextInput inputId="instruction" label="Instructions" placeholder="Directions given to visitor after checking in"
                                    handleChange={this.updateInstruction} required={true}/>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input type="checkbox" name="flagEmergency" value="1" onChange={this.updateEmergency}/> Flag as emergency
                                        &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right"
                                        title="If checked, choosing this reason will put the visitor into emergency mode."></i>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input type="checkbox" name="adminMenuShow" value="1" onChange={this.updateAdminMenu}/> Track on dashboard
                                        &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right"
                                        title="If checked, this reason will have a icon and tally on the dashboard."></i>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input type="checkbox" name="waitListed" value="1"  onChange={this.updateWaitListed} /> Put on wait list
                                        &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right"
                                        title="If checked, the visitor will be placed on the waiting list."></i>
                                </label>
                            </div>

                        </div>
                        <div className="col-sm-6">
                            <label>Icon</label>
                            <IconTable />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <button className="btn btn-primary" onClick={this.save}><i className="fa fa-save"></i> Save reason</button>&nbsp;
                            <button className="btn btn-danger" onClick={this.closeForm}><i className="fa fa-times"></i> Cancel</button>
                        </div>
                        <div className="col-sm-8">
                            {this.state.formError ? <div className="label label-danger" style={{fontSize : '1em'}}>Please complete all highlighted text inputs.</div> : null}
                        </div>
                    </div>
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
