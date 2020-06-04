import React from 'react';
import KeyIcon from '../../../Icons/ModernXP (7).png';
import { REST_URL } from '../../../REST_URL';
import './RunAsRootWindow.css';

export default class RunAsRootWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            password: '',
            command: this.props.command
        }

        this.handlePasswordSave = this.handlePasswordSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onOk = this.onOk.bind(this);
    }

    handlePasswordSave(e) {
        this.setState({
            password: e.target.value
        });
    }

    onOk(e) {
        this.setState({
            password: ''
        });
        fetch(REST_URL + '/API/SYSTEM/ACTIONS/runAsRoot.php?pwd="' + decodeURI(this.state.password) + '"&cmd="' + this.state.command + '"');
        this.props.onOk();
    }

    onCancel(e) {
        this.setState({
            password: ''
        })
        this.props.onCancel();
    }

    render() {
        return (<div className="RunAsRootWindow" style={{ zIndex: window.maxZIndex + 12 }}>
            <div className="Modal">
                <div className="Head">
                    <img draggable="false" src={KeyIcon} className="KeyIcon"></img>Run as Administrator
                    </div>
                <div className="Label">
                    Type your Administrator password to continue
                        <input
                        autoFocus
                        className="txtPassword"
                        type="password"
                        onChange={this.handlePasswordSave}
                        value={this.state.password}
                    />
                </div>
                <center>
                    <button className="rarbutton" onClick={this.onOk}>OK</button>
                    <button className="rarbutton" onClick={this.onCancel}>Cancel</button>
                </center>
            </div>
        </div>);
    }
}