import React, { Component } from 'react';
import NetworkItem from './NetworkItem/NetworkItem';
import { REST_URL } from '../../../../REST_URL';
import './NetworkManager.css';

class NetworkManager extends Component {
    constructor(props){
        super(props);

        this.state = {
            networksJson: undefined
        }

        setInterval(() => {
            fetch(REST_URL+'/API/SYSTEM/NETWORK/WIFI/getWifiList.php')
            .then(response => response.json())
            .then(json => {
                this.setState({ networksJson: json['data'] });
                this.forceUpdate();
            });
        }, 2000);
    }
    render() {
        let networksList=<div className="noNetworks">No networks avaliable</div>;
        if(this.state.networksJson !== undefined){
            if(this.state.networksJson.length !== 0){
                networksList=undefined;

                networksList=this.state.networksJson.map((data, key) => {
                    return (
                        <NetworkItem 
                            ssid={data.ssid}
                            inUse={data.inUse}
                            key={key}
                        />
                    );
                });   
            }       
        }

        

        if(this.props.visible){
            return (
                <div className="NetworkManager">
                    <div>Wifi networks</div>
                    <div className="NetworksList">
                        {networksList}
                    </div>
                </div>
            );
        }else{
            return null;
        }
    }
}

export default NetworkManager;