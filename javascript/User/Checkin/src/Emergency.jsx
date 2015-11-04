var Emergency = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    getDefaultProps: function() {
        return {
            update : null
        };
    },

    hasEmergency: function(answer) {
        this.props.update(answer);
    },


    render: function() {
        var content = (
            <div>
                <div className="text-center">
                    <p className="title">A few quick questions</p>
                    <p className="subtitle">Are you currently experiencing an emergency?</p>
                    <p style={{textAlign : 'left'}}>Examples of emergencies include recent:</p>
                    <ul>
                        <li>suicidal crisis</li>
                        <li>sexual assault</li>
                        <li>homicidal thoughts</li>
                        <li>death of a friend or loved one</li>
                        <li>unusual experiences such as hearing voices or seeing things other people do not</li>
                        <li>serious accident</li>
                        <li>other similar events</li>
                    </ul>
                    <button style={{marginRight:'1em',width: '100px'}} className="btn btn-default btn-lg" onClick={this.hasEmergency.bind(this, true)}>Yes</button>
                    <button style={{width: '100px'}}className="btn btn-default btn-lg" onClick={this.hasEmergency.bind(this, false)}>No</button>
                </div>
                <div className="clearfix"></div>
            </div>
        );
        return (
            <Box content={content}/>
        );
    }

});
