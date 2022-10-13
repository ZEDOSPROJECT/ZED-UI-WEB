import React from "react";
import arrow from "./arrow.png";
import refresh from "./refresh.png";
import go from "./go.png";
import "./toolBar.css";

class ToolBar extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props || nextState !== this.state ){
        return true;
    }
  }
  render() {
    return (
      <div className="explorer_topBar">
        <div className="btn" onClick={this.props.goBack}>
          <img draggable="false" alt="" style={{ width: 20, margin: 2 }} src={arrow} />
        </div>
        <div className="btn" onClick={this.props.goForward} >
          <img
            draggable="false"
            alt=""
            style={{ transform: "scaleX(-1)", width: 20, margin: 2 }}
            src={arrow}
          />
        </div>
        <div className="btn" onClick={this.props.refresh} >
          <img draggable="false" alt="" style={{ width: 20, margin: 2 }} src={refresh} />
        </div>
        <input className="addrBar" disabled value={this.props.currentPath} />
        <div className="btn" hidden>
          <img draggable="false" alt="" style={{ width: 20, margin: 2 }} src={go} />
        </div>
      </div>
    );
  }
}

export default ToolBar;
