var errorTimeout = {
    componentDidUpdate : function() {
        if (this.state.error === true) {
            this.interval = setInterval(function(){
                this.resetForm();
            }.bind(this), 5000);
        }
    },

    componentWillUnmount : function() {
        clearTimeout(this.interval);
    },

    resetForm : function() {
        clearTimeout(this.interval);
        this.setState({
            error : false
        });
    }
}
