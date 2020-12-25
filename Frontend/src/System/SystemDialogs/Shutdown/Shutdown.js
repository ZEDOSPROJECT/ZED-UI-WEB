import React from 'react';
import Logo from '../../../Icons/logo.png';
import standBy from './standby.png';
import turnoff from './turnoff.png';
import restart from './restart.png'
import RunAsRoot from '../../../Tools/Components/RunAsRootWindow/RunAsRootWindow';
import './Shutdown.css';

export default class Shutdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            standby: false,
            turnoff: false,
            restart: false,
            onAction: false
        }
        this.onShutdown = this.onShutdown.bind(this);
        this.onRestart = this.onRestart.bind(this);
        this.onStandby = this.onStandby.bind(this);

        this.onRestartCancel = this.onRestartCancel.bind(this);
        this.onStandbyCancel = this.onStandbyCancel.bind(this);
        this.onShutdownCancel = this.onShutdownCancel.bind(this);

        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        this.setState({
            standBy: false,
            restart: false,
            turnoff: false,
            visible: false,
            onAction: true
        })
    }

    onShutdown() {
        this.setState({
            turnoff: true
        })
    }

    onRestart() {
        this.setState({
            restart: true
        })
    }

    onStandby() {
        this.setState({
            standBy: true
        })
    }

    onShutdownCancel() {
        this.setState({
            turnoff: false
        })
    }

    onRestartCancel() {
        this.setState({
            restart: false
        })
    }

    onStandbyCancel() {
        this.setState({
            standBy: false
        })
    }

    render() {
        if (this.props.visible === true && this.state.visible!=false) {
            return (<div className="Shutdown" style={{ zIndex: window.maxZIndex + 10 }}>
                <div className="ShutdownDLG">
                    <div className="ShutdownLBL">
                        <b>Turn off computer</b>
                    </div>
                    <img draggable="false" alt="" className="ShutdownLogo" src={Logo}></img>
                    <div className="ShutdownMainDLG">
                        <center>
                            <div className="ShutdownBTN">
                                <div>
                                    <img alt="" draggable="false" onClick={this.onStandby} className="ShutdownBTNIcon" src={standBy} style={{ width: 50, height: 50 }}></img>
                                </div>
                                <div>
                                    Stand by
                                </div>
                            </div>
                            <div className="ShutdownBTN">
                                <div>
                                    <img alt="" draggable="false" onClick={this.onShutdown} className="ShutdownBTNIcon" src={turnoff} style={{ width: 50, height: 50 }}></img>
                                </div>
                                <div>
                                    Turn off
                                </div>
                            </div>
                            <div className="ShutdownBTN">
                                <div>
                                    <img alt="" draggable="false" onClick={this.onRestart} className="ShutdownBTNIcon" src={restart} style={{ width: 50, height: 50 }}></img>
                                </div>
                                <div>
                                    Restart
                                </div>
                            </div>
                        </center>
                    </div>
                    <button onClick={this.props.onCancel} className="ShutdownCancel">Cancel</button>
                </div>
                {this.state.turnoff ? (
                    <RunAsRoot
                        command="php ./POWER/shutdown.php"
                        onCancel={this.onShutdownCancel}
                        onOk={this.onOk}
                    />
                ) : null}

                {this.state.standBy ? (
                    <RunAsRoot
                        command="php ./POWER/suspend.php"
                        onCancel={this.onStandbyCancel}
                        onOk={this.onOk}
                    />
                ) : null}

                {this.state.restart ? (
                    <RunAsRoot
                        command="php ./POWER/reboot.php"
                        onCancel={this.onRestartCancel}
                        onOk={this.onOk}
                    />
                ) : null}

            </div>);
        } else {
            if(this.state.onAction){
                return (<div className="Shutdown" style={{ zIndex: window.maxZIndex + 10 }}/>);
            }else{
                return null;
            }
        }
    }
}