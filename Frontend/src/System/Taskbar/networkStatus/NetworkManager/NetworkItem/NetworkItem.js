import React, { Component } from 'react';
import { REST_URL } from '../../../../../REST_URL';
import SecurityICN from '../../../../../Icons/ModernXP (5).png';
import './NetworkItem.css';

class NetworkItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputPassword: "",
            showInputPassword: false
        }

        this.onConnect = this.onConnect.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.onConnectToNetwork = this.onConnectToNetwork.bind(this);
    }

    handlePasswordChange(e) {
        this.setState({
            inputPassword: e.target.value
        })
    }

    onConnect() {
        if (this.props.security !== "") {
            if (localStorage["WIFI_NETWORK_" + this.props.ssid] === undefined) {
                this.setState({
                    showInputPassword: true
                })
            } else {
                fetch(REST_URL + '/API/SYSTEM/NETWORK/WIFI/connectToWifi.php?ssid=' + this.props.ssid + "&password=" + localStorage["WIFI_NETWORK_" + this.props.ssid]);
            }
        } else {
            fetch(REST_URL + '/API/SYSTEM/NETWORK/WIFI/connectToWifi.php?ssid=' + this.props.ssid + "&password=");
        }
    }

    onConnectToNetwork() {
        const pwd = this.state.inputPassword;
        fetch(REST_URL + '/API/SYSTEM/NETWORK/WIFI/connectToWifi.php?ssid=' + this.props.ssid + "&password=" + pwd);
        this.setState({
            showInputPassword: false,
            inputPassword: ""
        })
        localStorage["WIFI_NETWORK_" + this.props.ssid] = pwd
    }

    onDisconnect() {
        fetch(REST_URL + '/API/SYSTEM/NETWORK/WIFI/disconnectWifi.php?ssid=' + this.props.ssid + "");
    }

    render() {
        let securityIcon = undefined;
        if (this.props.security !== "") {
            securityIcon = <img alt="" draggable="false" src={SecurityICN} />;
        }

        return (<div className={"NetworkItem " + (this.props.inUse === "*" ? "inUse" : "")}>
            {this.props.ssid}<br />
            <div className="NetworkItemSecurity">{securityIcon}</div>
            {this.props.inUse === "*" ? (<button onClick={this.onDisconnect}>Disconnect</button>) : (<button onClick={this.onConnect}>Connect</button>)}
            {this.state.showInputPassword ? (
                <div className="NetworkItemPassword">
                    <input
                        className="NetworkItemPasswordInput"
                        type="password"
                        placeholder="Insert Wifi Password"
                        onChange={this.handlePasswordChange}
                    />
                    <button onClick={this.onConnectToNetwork}>OK</button>
                </div>
            ) : undefined}
        </div>)
    }
}

export default NetworkItem;