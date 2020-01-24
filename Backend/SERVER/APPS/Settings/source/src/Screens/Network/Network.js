import React from 'react';

export default class Network extends React.Component {
    constructor(props){
        super(props);
        this.state={
            localIP:"0.0.0.0",
            ExternalIP:"0.0.0.0"
        }


        fetch("http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/NETWORK/getExternalIP.php")
        .then(response => response.text())
        .then(text => {
            this.setState({ ExternalIP: text });
        });

        fetch("http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/NETWORK/getPrivateIP.php")
        .then(response => response.text())
        .then(text => {
            this.setState({ localIP: text });
        });
    }
    render(){
        return(
            <div>
                <div>My External IP Adress: {this.state.ExternalIP}</div>
                <div>My Local IP Adress: {this.state.localIP}</div>
            </div>
        )
    }
}