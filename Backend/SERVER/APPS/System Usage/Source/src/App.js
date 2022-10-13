import React from "react";
import { Helmet } from 'react-helmet'
import { Circle } from "rc-progress";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpu: 0,
      ram: 0
    };
    setInterval(() => {
      let url = "http://" + window.location.hostname + ":3031/API/SYSTEM/getSystemUsage.php";
      fetch(url)
        .then(response => response.json())
        .then(json => {
          this.setState({
            cpu: Math.trunc(json.CPU),
            ram: Math.trunc(json.RAM)
          })
        });
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>{"System Monitor"}</title>
        </Helmet>
        <div>
          CPU Usage: {this.state.cpu}%<br />
          <Circle
            className="graf"
            percent={this.state.cpu}
            strokeWidth="2"
            strokeColor="green"
          />
        </div>
        <hr />
        <div>
          RAM Usage: {this.state.ram}%<br />
          <Circle
            className="graf"
            percent={this.state.ram}
            strokeWidth="2"
            strokeColor="blue"
          />
        </div>
      </div>
    );
  }
}
