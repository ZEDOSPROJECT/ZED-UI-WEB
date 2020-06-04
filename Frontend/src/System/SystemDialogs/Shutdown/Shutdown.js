import React from 'react';
import Logo from '../../../Icons/logo.png';
import standBy from './standby.png';
import turnoff from './turnoff.png';
import restart from './restart.png'
import { REST_URL } from '../../../REST_URL';
import './Shutdown.css';

export default class Shutdown extends React.Component {
    constructor(props) {
        super(props);

        this.onShutdown = this.onShutdown.bind(this);
        this.onRestart = this.onRestart.bind(this);
    }

    onShutdown() {
        fetch(REST_URL + '/API/SYSTEM/ACTIONS/POWER/shutdown.php');
    }

    onRestart() {
        fetch(REST_URL + '/API/SYSTEM/ACTIONS/POWER/reboot.php');
    }

    render() {
        if (this.props.visible === true) {
            return (<div className="Shutdown" style={{ zIndex: window.maxZIndex + 10 }}>
                <div className="ShutdownDLG">
                    <div className="ShutdownLBL">
                        <b>Turn off computer</b>
                    </div>
                    <img className="ShutdownLogo" src={Logo}></img>
                    <div className="ShutdownMainDLG">
                        <center>
                            <div className="ShutdownBTN">
                                <div>
                                    <img className="ShutdownBTNIcon" src={standBy} style={{ width: 50, height: 50 }}></img>
                                </div>
                                <div>
                                    Stand by
                                </div>
                            </div>
                            <div className="ShutdownBTN">
                                <div>
                                    <img onClick={this.onShutdown} className="ShutdownBTNIcon" src={turnoff} style={{ width: 50, height: 50 }}></img>
                                </div>
                                <div>
                                    Turn off
                                </div>
                            </div>
                            <div className="ShutdownBTN">
                                <div>
                                    <img onClick={this.onRestart} className="ShutdownBTNIcon" src={restart} style={{ width: 50, height: 50 }}></img>
                                </div>
                                <div>
                                    Restart
                                </div>
                            </div>
                        </center>
                    </div>
                    <button onClick={this.props.onCamcel} className="ShutdownCancel">Cancel</button>
                </div>
            </div>);
        } else {
            return null;
        }
    }
}