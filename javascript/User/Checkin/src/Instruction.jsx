var Instruction = React.createClass({
    getInitialState: function() {
        return {
            instructions : null
        };
    },

    getDefaultProps: function() {
        return {
            instruction : '1',
            instructionList : null
        };
    },

    componentDidMount : function() {
        setTimeout(function(){
            this.props.update();
        }.bind(this), 5000);
    },

    render: function() {
        var content = null;
        var instruction = null

        if (this.props.instruction === '1') {
            instruction = this.props.instructionList['1'];
        } else {
            instruction = this.props.instructionList['2'];
        }

        content = (
            <div>
                <div className="text-center">
                    <p className="title">Ok, you're checked in.</p>
                    <p className="subtitle">{instruction}</p>
                </div>
            </div>
        );

        return (
            <Box content={content}/>
        );
    }

});
