import React from "react";
import { Offline, Online } from "react-detect-offline";
import "./networkStatus.css";
import C0 from "./CONNECTED_0.png";
import C1 from "./CONNECTED_1.png";


class NetworkStatus extends React.Component {
  render() {
    return (
      <div className="NetworkStatus">
        <Online><img alt="" src={C1}/></Online>
        <Offline><img alt="" src={C0}/></Offline>
      </div>
    );
  }
}

export default NetworkStatus;
