var CurrentlySeen = React.createClass({
    getDefaultProps: function() {
        return {seen: null};
    },

    moveBack: function(id) {
        $.post('./counseling/Admin/Dashboard/Waiting', {
        	visitId: id,
            command: 'reset',
        }).done(function(data) {
            this.props.reload();
        }.bind(this), 'json');
    },

    render: function() {
        if (!this.props.seen) {
            return <div className="alert alert-info">No one is being seen</div>;
        }
        let seen = this.props.seen.map(function(value, key) {
            return (
                <span key={key} className="dropdown" style={{marginRight:'1em'}}>
                    <button className="btn btn-default" data-toggle="dropdown">{value.visitor.last_name}&nbsp;w/&nbsp;{value.clinician}&nbsp;
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <a style={{cursor: 'pointer'}} onClick={this.moveBack.bind(this, value.id)}>Move {value.visitor.preferred_name}&nbsp;
                                {value.visitor.last_name}&nbsp;back to queue</a>
                        </li>
                    </ul>
                </span>
            );
        }.bind(this));
        return (
            <div className="alert alert-info">
                <strong>Currently seen:&nbsp;
                </strong>
                {seen}
            </div>
        );
    }

});
