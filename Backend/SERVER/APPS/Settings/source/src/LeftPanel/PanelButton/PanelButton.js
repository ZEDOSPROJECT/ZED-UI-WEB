import React from "react";
import "./PanelButton.css";

class PanelButton extends React.Component {
  render() {
    let isActive = "PanelButton";
    const key = this.props.buttonKey;
    if (this.props.active) {
      isActive = "PanelButtonActive";
    }
    return (
      <div key={key} onClick={e => this.props.switchSetting(key)} className={isActive}>
        <div>{this.props.icon}</div>
        <div>{this.props.title}</div>
      </div>
    );
  }
}

export default PanelButton;
