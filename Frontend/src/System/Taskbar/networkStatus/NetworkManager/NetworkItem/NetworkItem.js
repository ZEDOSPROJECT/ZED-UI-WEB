import React, { Component } from 'react';
import { REST_URL } from '../../../../../REST_URL';
import './NetworkItem.css';

class NetworkItem extends Component {
    constructor(props){
        super(props);

        this.onConnect = this.onConnect.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
    }

    onConnect(){
        fetch(REST_URL+'/API/SYSTEM/NETWORK/WIFI/connectToWifi.php?ssid='+this.props.ssid+"&password=");
    }

    onDisconnect(){
        fetch(REST_URL+'/API/SYSTEM/NETWORK/WIFI/disconnectWifi.php?ssid='+this.props.ssid+"");
    }

    render() {
        if(this.props.inUse === "*"){
            return (
                <div className="NetworkItem inUse">
                    {this.props.ssid}<br/>
                    <button onClick={this.onDisconnect}>Disconnect</button>
                </div>
            );
        }else{
            return(
                <div className="NetworkItem">
                    {this.props.ssid}<br/>
                    <button onClick={this.onConnect}>Connect</button>
                </div>
            )
        }
    }
}

export default NetworkItem;