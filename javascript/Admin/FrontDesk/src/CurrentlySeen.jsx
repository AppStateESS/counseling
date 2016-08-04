var CurrentlySeen = React.createClass({
    getDefaultProps: function() {
        return {seen: null, reload: null};
    },

    getInitialState: function() {
        return {dispositions: [], seenId: 0};
    },

    componentDidMount: function() {
        this.loadDispositions();
    },

    loadDispositions: function() {
        $.getJSON('counseling/Admin/Clinician', {command: 'dispositionList'}).done(function(data) {
            this.setState({dispositions: data});
        }.bind(this));
    },

    moveBack: function(id) {
        $.post('./counseling/Admin/Dashboard/Waiting', {
            visitId: id,
            command: 'reset',
        }).done(function(data) {
            this.props.reload();
        }.bind(this), 'json');
    },

    complete: function(id) {
        this.setState({seenId: id});
        $('#reactModal').modal('show');
    },

    handleClick: function(dispositionId) {
        $.post('counseling/Admin/Clinician', {
            command: 'assignDisposition',
            dispositionId: dispositionId,
            visitId: this.state.seenId
        }, null, 'json').done(function(data) {
            this.closeModal();
        }.bind(this));
    },

    getModal: function() {
        let dispositions = null;
        let buttonClass = null;
        let iconClass = null;

        dispositions = this.state.dispositions.map(function(value, key) {
            buttonClass = 'btn btn-lg btn-block btn-' + value.color;
            iconClass = 'fa fa-' + value.icon;
            return (
                <button
                    key={key}
                    className={buttonClass}
                    onClick={this.handleClick.bind(null, value.id)}>
                    <i className={iconClass}></i>
                    {value.title}</button>
            );
        }.bind(this));
        let modalBody = (
            <div>
                {dispositions}
            </div>
        );
        return (<Modal body={modalBody} header='Assign disposition' onClose={this.closeModal}/>);
    },

    closeModal: function() {
        this.setState({seenId:0});
        this.props.reload();
        $('#reactModal').modal('hide');
    },

    render: function() {
        if (!this.props.seen) {
            return <div className="alert alert-info">No one is being seen</div>;
        }
        let modal = this.getModal();
        let seen = this.props.seen.map(function(value, key) {
            return (
                <span
                    key={value.visitor.id}
                    className="dropdown"
                    style={{
                    marginRight: '1em'
                }}>
                    <button className="btn btn-default" data-toggle="dropdown">{value.visitor.last_name}&nbsp;w/&nbsp; {value.clinician}&nbsp;<span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <a
                                style={{
                                cursor: 'pointer'
                            }}
                                onClick={this.moveBack.bind(this, value.id)}>
                                <i className="fa fa-reply"></i>&nbsp;Move&nbsp;{value.visitor.preferred_name}&nbsp; {value.visitor.last_name}&nbsp;back to queue</a>
                        </li>
                        <li>
                            <a
                                style={{
                                cursor: 'pointer'
                            }}
                                onClick={this.complete.bind(this, value.id)}>
                                <i className="fa fa-flag-checkered"></i>&nbsp;Complete {value.visitor.preferred_name}&nbsp;{value.visitor.last_name}'s consultation</a>
                        </li>
                    </ul>
                </span>
            );
        }.bind(this));
        return (
            <div>
                {modal}
                <div className="alert alert-info">
                    <strong>Currently seen:&nbsp;
                    </strong>
                    {seen}
                </div>
            </div>
        );
    }
});
