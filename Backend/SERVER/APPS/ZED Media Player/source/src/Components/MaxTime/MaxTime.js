import React, { Component } from 'react';
import './MaxTime.css';

class MaxTime extends Component {
    render() {
        return (
            <div className="MaxTime">
                {this.props.MaxTime}
            </div>
        );
    }
}

export default MaxTime;