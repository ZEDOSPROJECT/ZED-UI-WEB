import React from "react";
import mime from 'mime-types';
import ToolBar from "./ToolBar/toolBar";
import Explorer from "./Explorer/explorer";
import LeftBar from "./LeftBar/leftBar";
import StatusBar from "./StatusBar/statusBar";
import NewFolderDialog from '../Prompt/Prompt';
import clickSound from './click.mp3';
import { REST_URL } from './../../REST_URL';
import "./fileManager.css";

class FileManager extends React.Component {
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
      mainType:"",
      devices:undefined
    };

    setTimeout(() => {
      if(window.explorer_open !== undefined){
        const path=window.explorer_open.slice();
        this.setState({currentPath: path});
        window.explorer_open="";
        this.refresh();
      } 
    }, 10);

    this.onIClick = this.onIClick.bind(this);
    this.onDBClick = this.onDBClick.bind(this);
    this.listFolder = this.listFolder.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.refresh = this.refresh.bind(this);
    this.getDetails = this.getDetails.bind(this);
    this.onCreateFolderCancel = this.onCreateFolderCancel.bind(this);
    this.onCreateFolderReady = this.onCreateFolderReady.bind(this);
    this.onCreateFolderOpen = this.onCreateFolderOpen.bind(this);
  }

  onCreateFolderCancel(){
    this.setState({
      createFolderVisible: false
    });
  }

  onCreateFolderReady(name){
    fetch(REST_URL+'/API/SYSTEM/IO/PATH/createPath.php?path='+this.state.currentPath+name)
    .then(response => response.text())
    .then(text => {
      if(text!=="1"){
        console.log("ERROR");
      }else{
        this.listFolder(this.state.currentPath);
      }
    });
    this.setState({
      createFolderVisible: false
    });
  }

  onCreateFolderOpen(){
    this.setState({
      createFolderVisible: true
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

  getDetails(path){
    fetch(REST_URL+'/API/SYSTEM/IO/getInfo.php?path='+path)
    .then(response => response.json())
    .then(json => {
        let final;
        if(json.MIME==="directory"){
          final=<div style={{ fontSize: 12, overflow: "hidden" }}>
            <b>Type:</b> Folder <br/><br/>
            <b>Last Change</b> {json.LASTE_DATE}
          </div>
        }
        else{
          final=<div style={{ fontSize: 12, overflow: "hidden" }}>
            <b>Type:</b> {json.MIME}<br/>
            <p><b>Size:</b> {json.SIZE}<br/></p>
            <b>Last Change</b> {json.LASTE_DATE}
          </div>
        }

        this.setState({
          details: final,
        });
    });
  }

  listFolder(path){
    if(path !== "My Computer"){
      let tempArray=path.split("/");
      let currentTitle=tempArray[tempArray.length-2];
      if(currentTitle === ""){
        currentTitle="File System";
      }
      this.props.onTitleChange(currentTitle);
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
          let mimeTypes=[];
  
          JSONdata.data.forEach(file => {
            if(file.type!=="folder"){
              mimeTypes.push(mime.lookup(file.name));
            }
          });
  
          var mf = 1;
          var m = 0;
          var item;
          for (var i=0; i<mimeTypes.length; i++)
          {
              for (var j=i; j<mimeTypes.length; j++)
              {
                      if (mimeTypes[i] === mimeTypes[j])
                      m++;
                      if (mf<m)
                      {
                        mf=m; 
                        item = mimeTypes[i];
                      }
              }
              m=0;
          }
          this.setState({
            listDir: JSONdata.data,
            mainType: item
          });
      });
    }else{
      fetch(REST_URL+'/API/SYSTEM/IO/getDriveDevices.php')
      .then(response => response.json())
      .then(json => {
        this.setState({ devices: json });
      });
      this.props.onTitleChange(path);
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

  onIClick(data) {
    this.setState({ selected: data.name });
    this.getDetails(this.state.currentPath+data.name);
  }

  onDBClick(data) {
    this.setState({ selected: "" });
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
      const file=this.state.currentPath + data.name;
      const mimeType=mime.lookup(file);
      if(mimeType.includes("image/")){
        window.ZED_RUN={
          Label: 'Picture View',
          Url: REST_URL+'/APPS/Picture Visualizer/index.php?path='+file,
          Icon: REST_URL+"/API/SYSTEM/ICONS/ModernXP (27).png"
        } 
      } 
      if(mimeType.includes("audio/") || mimeType.includes("video/")){
        window.ZED_RUN={
          Label: 'ZED Media Player',
          Url: REST_URL+'/APPS/ZED Media Player/index.php?path='+file,
          Icon: REST_URL+"/APPS/ZED Media Player/favicon.png"
        } 
      }
    }
  }

  render() {
    return (
      <div className="fm">
        <ToolBar 
          refresh={this.refresh}
          goBack={this.goBack}
          goForward={this.goForward} 
          currentPath={this.state.currentPath}
        />
        <LeftBar
          listFolder={this.listFolder} 
          userDirs={this.props.userDirs}
          details={this.state.details}
          onCreateFolderOpen={this.onCreateFolderOpen}
        /> 
        <Explorer
          mainType={this.state.mainType}
          currentPath={this.state.currentPath} 
          onIClick={this.onIClick}
          onDBClick={this.onDBClick}
          selected={this.state.selected}
          listDir={this.state.listDir}
          devices={this.state.devices}
        />
        <StatusBar 
          items={this.state.listDir}
        />
        <NewFolderDialog 
          visible={this.state.createFolderVisible}
          onESQ={this.onCreateFolderCancel}
          onENTER={this.onCreateFolderReady}
          placeholder="New Folder"
          label="Name of new folder: "
        />
      </div>
    );
  }
}

export default FileManager;
