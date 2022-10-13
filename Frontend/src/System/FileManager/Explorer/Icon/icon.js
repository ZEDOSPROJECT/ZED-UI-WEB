import React from "react";
import Progress from 'react-progressbar';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import Folder from "./folder.png";
import File from "./file.png";
import AudioFile from "./audio.png";
import VideoFile from './video.png';
import TextFile from './text.png';
import PDFFile from './pdf.png';
import HDD from './hdd.png';
import mime from 'mime-types';
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
    }else if(this.props.data.type === "hdd") {
      theIcon = HDD;
    }else{
      let file=this.props.currentPath+this.props.data.name;
      const mimeType=mime.lookup(file);
      if(mimeType!==false){
        let hasIcon=false;
        if(mimeType.includes("image/")){
          if(this.props.searchMode){
            theIcon=REST_URL+'/API/SYSTEM/IO/FILE/read.php?path='+this.props.data.path+this.props.data.name;
          }else{
            theIcon=REST_URL+'/API/SYSTEM/IO/FILE/read.php?path='+this.props.currentPath+this.props.data.name;
          }
          hasIcon=true;
        }
        if(mimeType.includes("audio/")){
          theIcon = AudioFile;
          hasIcon=true;
        }
        if(mimeType.includes("application/pdf")){
          theIcon = PDFFile;
          hasIcon=true;
        }
        if(mimeType==="text/plain" || mimeType==="text/xml"){
          theIcon = TextFile;
          hasIcon=true;
        }
        if(mimeType.includes("video/")){
          theIcon = VideoFile;
          hasIcon=true;
        }
        if(!hasIcon){
          theIcon = File;
        }
      }else{
        theIcon = File;
      }
    }

    return (
      (this.state.ready ? (
          <LazyLoadComponent>
            <div
              style={
                this.props.data.name === this.props.selected
                  ? { backgroundColor: "#3191ef", color: "white" }
                  : null
              }
              title={this.props.data.name}
              onClick={data => this.props.onIClick(this.props.data)}
              onContextMenu={data => this.props.onRClick(this.props.data)}
              className="icon"
            >
            <LazyLoadImage
              draggable="false"
              alt=""
              src={theIcon}
              className="img"
            />
            <div className="label">{this.props.data.name}</div>
            {
              this.props.data.type === "hdd"
                ? ( <div className="usage"><Progress color="midnightblue" completed={this.props.data.fsuse} /></div> )
                : null
            }
          </div>
        </LazyLoadComponent>
      ) : null)
    );
  }
}

export default Icon;
