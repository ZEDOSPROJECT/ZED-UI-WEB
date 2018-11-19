import React from "react";
import arrow from "./arrow.png";
import refresh from "./refresh.png";
import go from "./go.png";
import "./toolBar.css";

class ToolBar extends React.Component {
  render() {
    return (
      <div className="explorer_topBar">
        <div className="btn">
          <img style={{ width: 20, margin: 5 }} src={arrow} />
        </div>
        <div className="btn">
          <img
            style={{ transform: "scaleX(-1)", width: 20, margin: 5 }}
            src={arrow}
          />
        </div>
        <div className="btn">
          <img style={{ width: 20, margin: 5 }} src={refresh} />
        </div>
        <input className="addrBar" disabled value={this.props.currentPath} />
        <div className="btn">
          <img style={{ width: 20, margin: 5 }} src={go} />
        </div>
      </div>
    );
  }
}

export default ToolBar;
