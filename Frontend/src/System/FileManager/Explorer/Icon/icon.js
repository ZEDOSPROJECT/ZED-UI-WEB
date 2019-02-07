import React from "react";
import Folder from "./folder.png";
import File from "./file.png";
import { REST_URL } from './../../../../REST_URL';
import "./icon.css";

let theIcon;

class Icon extends React.Component {
  render() {
    if (this.props.data.type === "folder") {
      theIcon = Folder;
    } else {
      if(this.props.data.name.toLowerCase().includes(".jpg") || this.props.data.name.toLowerCase().includes(".gif") || this.props.data.name.toLowerCase().includes(".png")){
        theIcon=REST_URL+'/API/SYSTEM/IO/FILE/read.php?path='+this.props.currentPath+this.props.data.name;
      }else{
        theIcon = File;
      } 
    }
    return (
      <div
        style={
          this.props.data.name === this.props.selected
            ? { backgroundColor: "#3191ef", color: "white" }
            : null
        }
        onClick={data => this.props.onIClick(this.props.data)}
        onDoubleClick={data => this.props.onDBClick(this.props.data)}
        className="icon"
      >
        <img alt="" src={theIcon} className="img" />
        <div className="label">{this.props.data.name}</div>
      </div>
    );
  }
}

export default Icon;
