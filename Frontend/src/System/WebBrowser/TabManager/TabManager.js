import React from "react";
import Tab from "./Tab/Tab";
import "./TabManager.css";

class TabManager extends React.Component {
  render() {
    return (
      <div className="TabManager">
        <Tab />
      </div>
    );
  }
}

export default TabManager;
