import React from 'react';
import mime from 'mime-types';
import ToolBar from "../../FileManager/ToolBar/toolBar";
import FileBrowser from '../../FileManager/Explorer/explorer';
import LeftBar from "../../FileManager/LeftBar/leftBar";
import clickSound from '../../FileManager/click.mp3';
import { REST_URL } from '../../../REST_URL';
import './save.css';

let detailsFlag=false;

class Save extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
          selected: "",
          currentPath: "/",
          listDir:[],
          history:["/"],
          historyIndex: 0,
          details:undefined,
          createFolderVisible: false,
          renameVisible: false,
          devices:undefined,
          removeVisible: false
        };
        
        this.onIClick = this.onIClick.bind(this);
        this.onDBClick = this.onDBClick.bind(this);
        this.listFolder = this.listFolder.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    listFolder(path){
        if(path !== "My Computer"){
          let tempArray=path.split("/");
          let currentTitle=tempArray[tempArray.length-2];
          if(currentTitle === ""){
            currentTitle="File System";
          }
          if(path.substr(path.length - 1)!=="/"){
            path=path+"/";
          }
          this.setState({
            currentPath: path,
            historyIndex: this.state.historyIndex,
            details:undefined
          });
          fetch(REST_URL+'/API/SYSTEM/IO/PATH/listPath.php?path='+path)
          .then(response => response.json())
          .then(json => {
              const JSONdata=JSON.parse(json);
              this.setState({
                listDir: JSONdata.data
              });
          });
        }else{
          fetch(REST_URL+'/API/SYSTEM/IO/getDriveDevices.php')
          .then(response => response.json())
          .then(json => {
            this.setState({ devices: json });
          });
          this.setState({
            currentPath: path,
            historyIndex: this.state.historyIndex,
            details:undefined
          });
        }
      } 
    
      componentWillMount(){
        this.listFolder(this.state.currentPath);
        fetch(REST_URL+'/API/SYSTEM/IO/getDriveDevices.php')
        .then(response => response.json())
        .then(json => {
          this.setState({ devices: json });
        });
      }

    refresh(){
        this.listFolder(this.state.currentPath);
    } 

    goForward(){
      if(this.state.historyIndex<this.state.history.length-1){
        const newPath=this.state.history[this.state.historyIndex+1]; 
        this.listFolder(newPath);
        this.setState({
          currentPath: newPath,
          historyIndex: this.state.historyIndex+1
        });
      } 
    } 
  
    goBack(){
      if(this.state.historyIndex>0){
        const newPath=this.state.history[this.state.historyIndex-1]; 
        this.listFolder(newPath);
        this.setState({
          currentPath: newPath,
          historyIndex: this.state.historyIndex-1
        });
      } 
    } 

    onIClick(data) {
        this.setState({ selected: data.name });
        detailsFlag=true;
      }
    
      onDBClick(data) {
        detailsFlag=false;
        this.setState({ selected: "",details:undefined });
        if (data.type === "folder") {
          const newPath=this.state.currentPath + data.name + "/";
          this.listFolder(newPath);
          let newHistory=[];
          for (let index = 0; index <= this.state.historyIndex; index++) {
            newHistory.push(this.state.history[index]);
          }
          newHistory.push(newPath);
          setTimeout(() => {
            this.setState({
              currentPath: newPath,
              historyIndex: this.state.historyIndex+1,
              history: newHistory,
              details: undefined,
            });
            let clickSoundPlayer = new Audio(clickSound);
            clickSoundPlayer.play();
          }, 10);
        } else if(data.type === "hdd"){
          let newPath=data.mountpoint;
          if(newPath.substr(newPath.length - 1)!=="/"){
            newPath=newPath+"/";
          }
          this.listFolder(newPath);
          let newHistory=[];
          for (let index = 0; index <= this.state.historyIndex; index++) {
            newHistory.push(this.state.history[index]);
          }
          newHistory.push(newPath);
          setTimeout(() => {
            this.setState({
              currentPath: newPath,
              historyIndex: this.state.historyIndex+1,
              history: newHistory,
              details: undefined,
            });
            let clickSoundPlayer = new Audio(clickSound);
            clickSoundPlayer.play();
          }, 10);
        }else{
          console.log(data.name);
        }
      }

    render(){
        return(
            <div className="saveDialog">
              <ToolBar 
                refresh={this.refresh}
                goBack={this.goBack}
                goForward={this.goForward} 
                currentPath={this.state.currentPath}
              />
              <LeftBar
                listFolder={this.listFolder} 
                userDirs={this.props.userDirs}
                saveDialog={true}
              /> 
              <div className="ExplorerContainer">
                <FileBrowser
                  mainType={this.state.mainType}
                  currentPath={this.state.currentPath} 
                  onIClick={this.onIClick}
                  onDBClick={this.onDBClick}
                  selected={this.state.selected}
                  listDir={this.state.listDir}
                  devices={this.state.devices}
                />
              </div>
              <div className="saveBottomArea">
                <div className="Label">File Name: </div>
                <input className="fileNameInput" type="text" />
                <button>Save</button>
                <button>Cancel</button>
              </div>
            </div>
        );
    }
}

export default Save;