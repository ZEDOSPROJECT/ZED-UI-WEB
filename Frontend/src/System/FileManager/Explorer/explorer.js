import React from "react";
import { Portal } from 'react-portal';
import { ControlledMenu, MenuItem, useMenuState } from "@szhsin/react-menu";
import '@szhsin/react-menu/dist/index.css';
import Icon from "./Icon/icon";
import mimeMusic from './types/music.png';
import mimeVideo from './types/video.png';
import mimeImage from './types/image.png';
import loadingAnim from './loading.gif';
import CategoryTitle from './CategoryTitle/CategoryTitle';
import "./explorer.css";

class Explorer extends React.Component {
  constructor(props) {
    super(props);

    this.onRClick = this.onRClick.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true;
    }
  }

  onRClick(data) {
    this.props.onRClick(data);

  }

  render() {
    let indents;
    let currentType = null;
    let devices = null;
    if (this.props.currentPath === "My Computer") {
      if (this.props.devices !== undefined) {
        devices = this.props.devices.map(data => {
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
        indents = <div><CategoryTitle label="Hard Disk Drives" />{devices}</div>
      }
    } else {
      if (this.props.mainType !== false && this.props.mainType !== undefined) {
        if (this.props.mainType.includes("image/")) {
          currentType = mimeImage;
        }
        if (this.props.mainType.includes("audio/")) {
          currentType = mimeMusic;
        }
        if (this.props.mainType.includes("video/")) {
          currentType = mimeVideo;
        }
      }

      if (this.props.searchMode) {
        if (this.props.searchListDir !== undefined) {
          if (this.props.searchListDir.length !== 0) {
            indents = this.props.searchListDir.map(data => {
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
          } else {
            indents = <div id="explorerFS" style={{ color: 'black', marginTop: 20 }}><center>This folder is empty</center></div>
          }
        } else {
          indents = <div>Searching . . .</div>;
        }
      } else {
        if (this.props.listDir !== undefined) {
          if (this.props.listDir.length !== 0) {
            indents = this.props.listDir.map(data => {
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
          } else {
            indents = <div id="explorerFS" style={{ color: 'black', marginTop: 20 }}><center>This folder is empty</center></div>
          }
        } else {
          indents = <div>Loading . . .</div>;
        }
      }
    }

    if(this.props.isReady){
      return (
        <ExplorerWithContextMenu 
          {...this.props}
          currentType={currentType}
          indents={indents}
        />
      );
    }else{
      return <div>
        <img className="explorerLoading" src={loadingAnim} draggable="false" alt="" />
      </div>;
    }    
  }
}

// Wrapper funcional para usar o hook useMenuState
function ExplorerWithContextMenu(props) {
  const [menuState, toggleMenu] = useMenuState({ unmountOnClose: true });
  const [anchorPoint, setAnchorPoint] = React.useState({ x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    toggleMenu(true);
  };

  return (
    <div className="fExplorer">
      <img className="typeF" draggable="false" alt="" src={props.currentType} />
      <div onContextMenu={handleContextMenu}>
        {props.indents}
      </div>
      
      <ControlledMenu 
        {...menuState} 
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <MenuItem onClick={(e) => {props.onOpen(e); toggleMenu(false);}}>
          <b>Open</b>
        </MenuItem>
        <MenuItem type="separator" />
        <MenuItem onClick={(e) => {props.onCopy(e); toggleMenu(false);}}>
          Copy
        </MenuItem>
        <MenuItem onClick={(e) => {props.onRenameOpen(e); toggleMenu(false);}}>
          Rename
        </MenuItem>
        <MenuItem type="separator" />
        <MenuItem onClick={(e) => {props.onRemoveOpen(e); toggleMenu(false);}}>
          Delete
        </MenuItem>
        <MenuItem type="separator" />
        <MenuItem onClick={(e) => {props.onShowProprieties(e); toggleMenu(false);}}>
          Properties
        </MenuItem>
      </ControlledMenu>
    </div>
  );
}

export default Explorer;
