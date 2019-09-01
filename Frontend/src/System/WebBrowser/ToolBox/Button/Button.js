import React from "react";
import "./Button.css";

class ReactButton extends React.Component {
  render() {
    return (
      <div onClick={this.props.onClick} className="ReactButton">
        <img draggable="false" src={this.props.icon} width="25" alt="" />
      </div>
    );
  }
}

export default ReactButton;
