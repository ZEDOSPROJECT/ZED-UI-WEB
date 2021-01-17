import React, { Component } from 'react';
import './CurrentTime.css';

class CurrentTime extends Component {
    render() {
        return (
            <div className="CurrentTime">
                {this.props.CurrentTime}
            </div>
        );
    }
}

export default CurrentTime;