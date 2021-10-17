import React from "react";
import { Offline, Online } from "react-detect-offline";
import onClickOutside from 'react-onclickoutside';
import NetworkManager from './NetworkManager/NetworkManager';
import { REST_URL } from '../../../REST_URL';
import "./networkStatus.css";
import C0 from "./CONNECTED_0.png";
import C1 from "./CONNECTED_1.png";

class NetworkStatus extends React.PureComponent {
  constructor(props){
    super(props);

    this.state = {
      NetworkManagerVisible: false
    }

    this.toggleNetworkManager = this.toggleNetworkManager.bind(this);
    this.hideWifiList = this.hideWifiList.bind(this);
  }

  hideWifiList(){
    this.setState({
      NetworkManagerVisible:false
    })
  }
  
  iHaveInternet(){
    localStorage.hasInternet=true;
    window.loadUserSettings="X";
    window.loadApps="X";
    setTimeout(() => {
      fetch(REST_URL + '/API/SYSTEM/NETWORK/WIFI/getCurrent.php')
      .then(response => response.text())
      .then(text => {
        localStorage.currentLAN=text;
      });
    }, 100);
  }

  iDontHaveInternet(){
    localStorage.hasInternet=false;
    window.loadUserSettings="X";
    localStorage.currentLAN="";
    window.loadApps="X";
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props || nextState !== this.state ){
        return true;
    }
  } 

  handleClickOutside(){
    this.setState({ NetworkManagerVisible: false});
  }

  toggleNetworkManager(){
    this.setState({ NetworkManagerVisible: !this.state.NetworkManagerVisible});
  }

  render() {
    return (
      <div className="NetworkStatus">
        <Online>
          <img onClick={this.toggleNetworkManager} onLoad={this.iHaveInternet} draggable="false" alt="" src={C1}/>
        </Online>
        <Offline>
          <img onClick={this.toggleNetworkManager} onLoad={this.iDontHaveInternet} draggable="false" alt="" src={C0}/>
        </Offline>
        <NetworkManager hideWifiList={this.hideWifiList} visible={this.state.NetworkManagerVisible} />
      </div>
    );
  }
}

export default onClickOutside(NetworkStatus);
