import React from "react";
import "./settingContext.css";

class settingContext extends React.Component {
  render() {
    return (
      <div>
        <div className="settingTitle">
          <h2>
            <i>{this.props.title}</i>
          </h2>
        </div>
        <div className="SettingArea">{this.props.children}</div>
      </div>
    );
  }
}

export default settingContext;
