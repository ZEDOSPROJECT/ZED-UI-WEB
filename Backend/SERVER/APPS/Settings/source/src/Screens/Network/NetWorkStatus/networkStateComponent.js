import React from "react";
import sPC from "./imgsStatus/PC.png";
import sInternet from "./imgsStatus/internet.png";
import sNetwork from "./imgsStatus/network.png";
import "./styles.css";

export default class NetworkStatus extends React.Component {
  render() {
    if (this.props.local === "") {
      return (
        <div draggable="false">
          <img src={sPC} height="100" alt="" />
          <div>
            <b>STATE:</b> Without network connection
          </div>
        </div>
      );
    } else if (this.props.internet === "") {
      return (
        <div draggable="false">
          <img src={sNetwork} height="100" alt="" />
          <div>
            <b>STATE:</b> Connected to a network without internet connnection
          </div>
        </div>
      );
    } else {
      return (
        <div draggable="false">
          <img src={sInternet} height="100" alt="" />
          <div>
            <b>STATE:</b> Connected to network and internet
          </div>
        </div>
      );
    }
  }
}
