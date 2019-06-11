import React from "react";
import TabManager from "./TabManager/TabManager";

import "./styles.css";
import BrowserContainer from "./BrowserContainer/BrowserContainer";

class WebBrowser extends React.Component {
  render() {
    return (
      <div className="WebBrowser dontMove">
        <TabManager />
        <BrowserContainer />
      </div>
    );
  }
}

export default WebBrowser;
