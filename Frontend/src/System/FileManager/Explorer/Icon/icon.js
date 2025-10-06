import React from "react";
import Progress from 'react-progressbar';
import Folder from "./folder.png";
import File from "./file.png";
import AudioFile from "./audio.png";
import VideoFile from './video.png';
import TextFile from './text.png';
import PDFFile from './pdf.png';
import JPGFile from './jpg.png';
import PNGFile from './png.png';
import GIFFile from './gif.png';
import IMGFile from './img.png';
import HDD from './hdd.png';
import mime from 'mime-types';
import { REST_URL } from './../../../../REST_URL';
import "./icon.css";

class Icon extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ready: false,
      theIcon: File
    }  
  } 

  componentDidMount(){
    let theIcon=undefined;
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
          let path="";
          if(this.props.searchMode){
            path=this.props.data.path+this.props.data.name;
          }else{
            path=this.props.currentPath+this.props.data.name;
          }
          const extension = path.split('.').pop().toLowerCase();

          if (extension === 'jpg') {
            theIcon=JPGFile;
          } else if (extension === 'png') {
            theIcon=PNGFile;
          } else if (extension === 'gif') {
            theIcon=GIFFile;
          } else {
            theIcon=IMGFile;
          }

          hasIcon=true;

          fetch(REST_URL+'/API/SYSTEM/IO/PATH/getThumb.php?path='+path)
          .then(response => response.blob())
          .then(blob => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              this.setState({
                theIcon: reader.result
              });
            }
          })
          .catch(error => {
            this.setState({
              ready: true,
              theIcon: file
            });
          });
        
        
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
    this.setState({
      ready:true,
      theIcon
    });
  } 

  render() {
    return (
      (this.state.ready ? (
          <div>
            <div
              style={
                this.props.data.name === this.props.selected
                  ? { backgroundColor: "#3191ef", color: "white" }
                  : null
              }
              title={this.props.data.name}
              onClick={(data) => {this.props.onIClick(this.props.data)}}
              onContextMenu={(e) => {e.preventDefault(); e.stopPropagation(); this.props.onRClick(this.props.data, e)}}
              className="icon"
            >
            <img
              draggable="false"
              alt=""
              src={this.state.theIcon}
              className="img"
            />
            <div className="label">{this.props.data.name}</div>
            {
              this.props.data.type === "hdd"
                ? ( <div className="usage"><Progress color="midnightblue" completed={this.props.data.fsuse} /></div> )
                : null
            }
          </div>
        </div>
      ) : null)
    );
  }
}

export default Icon;
