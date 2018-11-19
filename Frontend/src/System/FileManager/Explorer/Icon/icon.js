import React from "react";
import Folder from "./folder.png";
import File from "./file.png";
import "./icon.css";

class Icon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let theIcon;
    if (this.props.data.type === "folder") {
      theIcon = Folder;
    } else {
      theIcon = File;
    }
    return (
      <div
        style={
          this.props.data.name == this.props.selected
            ? { backgroundColor: "#3191ef", color: "white" }
            : null
        }
        onClick={data => this.props.onIClick(this.props.data)}
        onDoubleClick={data => this.props.onDBClick(this.props.data)}
        className="icon"
      >
        <img src={theIcon} className="img" />
        <div className="label">{this.props.data.name}</div>
      </div>
    );
  }
}

export default Icon;
