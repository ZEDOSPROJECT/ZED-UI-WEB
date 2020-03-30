import React from "react";
import { Portal } from 'react-portal';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Icon from "./Icon/icon";
import mimeMusic from './types/music.png';
import mimeVideo from './types/video.png';
import mimeImage from './types/image.png';
import CategoryTitle from './CategoryTitle/CategoryTitle';
import "./explorer.css";

class Explorer extends React.Component {
  constructor(props){
    super(props);

    this.onRClick = this.onRClick.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props || nextState !== this.state ){
        return true;
    }
  }

  onRClick(data){
    this.props.onRClick(data);

  }

  render() {
    let indents;
    let currentType=null;
    let devices=null;
    if(this.props.currentPath === "My Computer"){
      if(this.props.devices !== undefined){
        devices=this.props.devices.map(data => {
          return (
            <Icon
              currentPath={this.props.currentPath} 
              onIClick={this.props.onIClick}
              onRClick={this.onRClick}
              selected={this.props.selected}
              key={data.name}
              data={data}
            />
          );
        }); 
        indents=<div><CategoryTitle label="Hard Disk Drives"/>{devices}</div>
      }
    }else{
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

      if(this.props.searchMode){
        if(this.props.searchListDir !== undefined){
          if(this.props.searchListDir.length !== 0){
            indents=this.props.searchListDir.map(data => {
              return (
                <Icon
                  currentPath={this.props.currentPath} 
                  onIClick={this.props.onIClick}
                  onRClick={this.props.onRClick}
                  selected={this.props.selected}
                  searchMode={this.props.searchMode}
                  key={data.name}
                  data={data}
                />
              );
            }); 
          }else{
            indents=<div id="explorerFS" style={{ color: 'black', marginTop: 20 }}><center>This folder is empty</center></div>
          } 
        }else {
          indents=<div>Searching . . .</div>;
        } 
      }else{
        if(this.props.listDir !== undefined){
          if(this.props.listDir.length !== 0){
            indents=this.props.listDir.map(data => {
              return (
                <Icon
                  currentPath={this.props.currentPath} 
                  onIClick={this.props.onIClick}
                  onRClick={this.props.onRClick}
                  selected={this.props.selected}
                  searchMode={this.props.searchMode}
                  key={data.name}
                  data={data}
                />
              );
            }); 
          }else{
            indents=<div id="explorerFS" style={{ color: 'black', marginTop: 20 }}><center>This folder is empty</center></div>
          } 
        }else {
          indents=<div>Loading . . .</div>;
        } 
      }
    }
    
    return( <div className="fExplorer">
            <img className="typeF" draggable="false" alt="" src={currentType} />
            <ContextMenuTrigger id="fileManager.explorer.files"> 
            {indents}
            </ContextMenuTrigger>
            <Portal>
              <ContextMenu id="fileManager.explorer.files">
                <MenuItem onClick={this.props.onOpen}>
                  <b>Open</b>
                </MenuItem>
                <MenuItem divider />
                <MenuItem onClick={this.props.onCopy}>
                  Copy
                </MenuItem>
                <MenuItem onClick={this.props.onRenameOpen}>
                  Rename
                </MenuItem>
                <MenuItem divider />
                <MenuItem onClick={this.props.onRemoveOpen}>
                  Delete
                </MenuItem>
                <MenuItem divider />
                <MenuItem onClick={this.handleClick}>
                  Proprieties
                </MenuItem>
              </ContextMenu>
            </Portal>
          </div>
          );
  }
}

export default Explorer;
