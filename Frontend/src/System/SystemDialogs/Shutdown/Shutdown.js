import React from 'react';
import Logo from '../../../Icons/logo.png';
import standBy from './standby.png';
import turnoff from './turnoff.png';
import restart from './restart.png'
import './Shutdown.css';

export default class Shutdown extends React.Component {
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
                                    <img className="ShutdownBTNIcon" src={turnoff} style={{ width: 50, height: 50 }}></img>
                                </div>
                                <div>
                                    Turn off
                                </div>
                            </div>
                            <div className="ShutdownBTN">
                                <div>
                                    <img className="ShutdownBTNIcon" src={restart} style={{ width: 50, height: 50 }}></img>
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