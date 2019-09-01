import React from "react";
import { Offline, Online } from "react-detect-offline";
import "./networkStatus.css";
import C0 from "./CONNECTED_0.png";
import C1 from "./CONNECTED_1.png";


class NetworkStatus extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props || nextState !== this.state ){
        return true;
    }
  } 

  render() {
    return (
      <div className="NetworkStatus">
        <Online><img draggable="false" alt="" src={C1}/></Online>
        <Offline><img draggable="false" alt="" src={C0}/></Offline>
      </div>
    );
  }
}

export default NetworkStatus;
