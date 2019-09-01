import React from "react";
import Icon from "./Icon/icon";
import mimeMusic from './types/music.png';
import mimeVideo from './types/video.png';
import mimeImage from './types/image.png';
import "./explorer.css";

class Explorer extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props || nextState !== this.state ){
        return true;
    }
  }

  render() {
    let indents;
    let currentType=null;
    if(this.props.mainType!==false && this.props.mainType!==undefined){
      if(this.props.mainType.includes("image/")){
        currentType=mimeImage;
      }
      if(this.props.mainType.includes("audio/")){
        currentType=mimeMusic;
      }
      if(this.props.mainType.includes("video/")){
        currentType=mimeVideo;
      }
    }
    if(this.props.listDir !== undefined){
      if(this.props.listDir.length !== 0){
        indents=this.props.listDir.map(data => {
          return (
            <Icon
              currentPath={this.props.currentPath} 
              onIClick={this.props.onIClick}
              onDBClick={this.props.onDBClick}
              selected={this.props.selected}
              key={data.name}
              data={data}
            />
          );
        }); 
      }else{
        indents=<div style={{ color: 'black', marginTop: 20 }}><center>This folder is empty</center></div>
      } 
    }else {
      indents=<div>Loading . . .</div>;
    } 
    return( <div className="fExplorer">
            <img className="typeF" draggable="false" src={currentType} />
            {indents}
          </div>
          );
  }
}

export default Explorer;
