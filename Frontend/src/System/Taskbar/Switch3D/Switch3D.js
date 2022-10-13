import React from 'react';
import './Switch3D.css';

export default class Switch3D extends React.Component {
    render() {
        return (
            <div onClick={this.props.onSwitch3DClick} className="Switch3D">
                <b>{this.props.notSwitch3Dlbl}</b>
            </div>
        )
    }
}
