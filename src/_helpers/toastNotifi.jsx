import React from 'react';
import { connect } from 'react-redux';


class ServerResponseAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        const { title } = this.props;

        return (
            <React.Fragment>
                <div className="notification-title">{title}</div>

            </React.Fragment>
        );
    }
}

export default connect(null, null)(ServerResponseAlert);
