import React from "react";
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
      NetworkManagerVisible: false,
      isOnline: navigator.onLine
    }

    this.toggleNetworkManager = this.toggleNetworkManager.bind(this);
    this.hideWifiList = this.hideWifiList.bind(this);
    this.checkConnection = this.checkConnection.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
  }

  componentDidMount() {
    // Set initial internet status immediately
    if (navigator.onLine) {
      localStorage.hasInternet = 'true';
      this.setState({ isOnline: true });
    } else {
      localStorage.hasInternet = 'false';
      this.setState({ isOnline: false });
    }
    
    // Check connection with external server
    this.checkConnection();
    
    // Add event listeners for online/offline
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Check connection periodically
    this.connectionInterval = setInterval(this.checkConnection, 30000); // every 30 seconds
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    if (this.connectionInterval) {
      clearInterval(this.connectionInterval);
    }
  }

  checkConnection() {
    if (!navigator.onLine) {
      this.handleOffline();
      return;
    }

    // Try to fetch from Google's DNS to verify real internet connection
    // Using a reliable external server instead of our own API
    fetch('https://dns.google/resolve?name=google.com&type=A', {
      method: 'GET',
      cache: 'no-cache',
      mode: 'cors'
    })
      .then(response => {
        if (response.ok) {
          this.handleOnline();
        } else {
          this.handleOffline();
        }
      })
      .catch(() => {
        // If Google DNS fails, we're definitely offline
        this.handleOffline();
      });
  }

  hideWifiList(){
    this.setState({
      NetworkManagerVisible: false
    })
  }
  
  handleOnline(){
    localStorage.hasInternet = 'true';
    this.setState({ isOnline: true });
    window.loadUserSettings = "X";
    window.loadApps = "X";
    
    // Fetch current network info
    fetch(REST_URL + '/API/SYSTEM/NETWORK/WIFI/getCurrent.php')
      .then(response => response.text())
      .then(text => {
        localStorage.currentLAN = text;
      })
      .catch(err => {
        console.error('Error fetching network info:', err);
      });
  }

  handleOffline(){
    localStorage.hasInternet = 'false';
    this.setState({ isOnline: false });
    window.loadUserSettings = "X";
    localStorage.currentLAN = "";
    window.loadApps = "X";
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
    const { isOnline } = this.state;
    
    return (
      <div className="NetworkStatus">
        <img 
          onClick={this.toggleNetworkManager} 
          draggable="false" 
          alt={isOnline ? "Connected" : "Disconnected"}
          src={isOnline ? C1 : C0}
          title={isOnline ? "Connected to Internet" : "No Internet Connection"}
        />
        <NetworkManager hideWifiList={this.hideWifiList} visible={this.state.NetworkManagerVisible} />
      </div>
    );
  }
}

export default onClickOutside(NetworkStatus);
