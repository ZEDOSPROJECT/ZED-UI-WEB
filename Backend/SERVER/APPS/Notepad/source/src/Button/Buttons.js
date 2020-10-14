import React from "react";
import "./Buttons.css";

export default class Buttons extends React.Component {
  render() {
    return (
      <button className="Buttons" onClick={this.props.onClick}>
        <img
          className="ButtonsIcon"
          draggable="false"
          src={this.props.icon}
          alt=""
        />
      </button>
    );
  }
}
