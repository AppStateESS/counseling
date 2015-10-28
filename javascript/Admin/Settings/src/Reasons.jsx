var Reasons = React.createClass({
    getInitialState: function() {
        return {
            showForm : true
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    render: function() {
        var form = null;
        if (this.state.showForm) {
            form = <ReasonForm />;
        }

        return (
            <div>
                <button className="btn btn-success"><i className="fa fa-plus"></i> Add reason</button>
                <hr />
                {form}
            </div>
        );
    }
});

var ReasonForm = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
        };
    },

    componentDidMount: function() {
        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="label">Label</label>
                            <input id="label" type="text" name="label" className="form-control" placeholder="One or two words describing reason. Internal use only."/>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="summary">Summary</label>
                            <input id="summary" type="text" name="summary" className="form-control" placeholder="Description of reason. Seen by visitors."/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label htmlFor="instruction">Instructions</label>
                            <textarea id="instruction" type="text" name="instruction" className="form-control" placeholder="Directions given to visitor after checking in"/>
                        </div>

                        <div className="form-group">
                            <label>
                                <input type="checkbox" name="flagEmergency" value="1" /> Flag as emergency
                                    &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right" title="If checked, choosing this reason will put the visitor into emergency mode."></i>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input type="checkbox" name="adminMenuShow" value="1" /> Track on dashboard
                                    &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right" title="If checked, this reason will have a icon and tally on the dashboard."></i>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input type="checkbox" name="waitListed" value="1" /> Put on wait list
                                    &nbsp;<i className="fa fa-question-circle pointer" data-toggle="tooltip" data-placement="right" title="If checked, the visitor will be placed on the waiting list."></i>
                            </label>
                        </div>

                    </div>
                    <div className="col-sm-6">
                        <label>Icon</label>
                        <IconTable />
                    </div>
                </div>
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
