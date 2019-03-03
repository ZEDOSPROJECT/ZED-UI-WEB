import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Folder from "./folder.png";
import File from "./file.png";
import AudioFile from "./audio.png";
import VideoFile from './video.png';
import { REST_URL } from './../../../../REST_URL';
import "./icon.css";

let theIcon;

class Icon extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ready: false
    }  
  } 

  componentDidMount(){
    this.setState({
      ready:true
    });
  } 

  render() {
    if (this.props.data.type === "folder") {
      theIcon = Folder;
    } else {
      if(this.props.data.name.toLowerCase().includes(".jpg") || this.props.data.name.toLowerCase().includes(".gif") || this.props.data.name.toLowerCase().includes(".png")){
        theIcon=REST_URL+'/API/SYSTEM/IO/FILE/read.php?path='+this.props.currentPath+this.props.data.name;
      }else if(this.props.data.name.toLowerCase().includes(".ogg") || this.props.data.name.toLowerCase().includes(".mp3") || this.props.data.name.toLowerCase().includes(".wav")){
        theIcon = AudioFile;
      }else if(this.props.data.name.toLowerCase().includes(".ogv") || this.props.data.name.toLowerCase().includes(".avi") || this.props.data.name.toLowerCase().includes(".mp4")){
        theIcon = VideoFile;
      }else{
        theIcon = File;
      } 
    }
    return (
      (this.state.ready ? (
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
          <LazyLoadImage alt="" src={theIcon} className="img" />
          <div className="label">{this.props.data.name}</div>
        </div>
      ) : null)
    );
  }
}

export default Icon;
