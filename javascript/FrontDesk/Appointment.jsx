var Appointment = React.createClass({
    getDefaultProps: function() {
        return {appointments: null, reload: null,};
    },

    render: function() {
        if (this.props.appointments === null) {
            return <div>No appointments waiting</div>;
        }
        let count = 0;

        let listRows = this.props.appointments.map(function(value, key) {
            count++;
            return <AppointmentRow key={key} {...value} count={count} reload={this.props.reload}/>;
        }.bind(this));

        return (
            <div className="appointment-list">
                <table className="table">
                    <tbody>
                        <tr>
                            <th>#</th>
                            <th>&nbsp;</th>
                            <th>Name</th>
                            <th>Banner id</th>
                            <th>Visits</th>
                            <th>Status</th>
                            <th>&nbsp;</th>
                        </tr>
                        {listRows}
                    </tbody>
                </table>
            </div>
        );
    },
});

var AppointmentRow = React.createClass({
    getDefaultProps: function() {
        return {
            id: 0,
            category: 0,
            color: 'default',
            reason_title: '',
            total_visits: 0,
            visitor: {},
            visitor_id: 0,
            reload: null
        };
    },

    render: function() {
        let count = this.props.count;
        let _className = 'bg-' + this.props.color;
        return (
            <tr className={_className}>
                <td style={{
                    width: '3%'
                }}>{count}</td>
                <td
                    style={{
                    width: '3%'
                }}
                    className="text-center">
                    <CategoryIcon
                        category={this.props.category}
                        reasonTitle={this.props.reason_title}/></td>
                <td><VisitorName visitor={this.props.visitor}/></td>
                <td>
                    <ClipboardInput bannerId={this.props.visitor.banner_id}/>
                </td>
                <td><WaitingListVisits visitNumber={this.props.total_visits}/></td>
                <td>
                    <WaitingListStatus
                        visitor={this.props.visitor}
                        reload={this.props.reload}
                        visitNumber={this.props.total_visits}/>
                </td>
                <td><AppointmentAction visitId={this.props.id} reload={this.props.reload}/></td>
            </tr>
        );
    },
});

var AppointmentAction = React.createClass({

    getDefaultProps: function() {
        return {visitId: 0};
    },

    completeReason: function(reason) {
        $.post('counseling/Admin/Dashboard/Waiting', {
            command: 'setCompleteReason',
            reason: reason,
            visitId: this.props.visitId
        }, null, 'json').done(function(data) {
            this.props.reload();
        }.bind(this));
    },

    remove: function() {
        if (confirm('Are you sure you want to remove this visitor?')) {
            $.post('counseling/Admin/Dashboard/Waiting', {
                command: 'delete',
                visitId: this.props.visitId
            }, null, 'json').done(function(data) {
                this.props.reload();
            }.bind(this));
        }
    },

    getOptions: function() {
        var options = [];
        options.push({
            label: <div className="text-success">
                <strong>
                    <i className="fa fa-thumbs-o-up"></i>&nbsp; Send back</strong>
            </div>,
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 5)
        }, {
            divider: true
        }, {
            label: <div>
                <i className="fa fa-external-link"></i>&nbsp; Had to leave</div>,
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 2)
        }, {
            label: <div>
                <i className="fa fa-eye-slash"></i>&nbsp; Missing</div>,
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 3)
        }, {
            divider: true
        }, {
            label: <div className="text-danger">
                <i className="fa fa-trash-o"></i>&nbsp; Remove</div>,
            visitId: this.props.visitId,
            handleClick: this.remove
        });
        return options;
    },

    render: function() {
        var options = this.getOptions();
        return (<ButtonGroup options={options}/>);
    }
});
