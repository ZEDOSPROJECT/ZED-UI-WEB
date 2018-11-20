import React from "react";
import ToolBar from "./ToolBar/toolBar";
import Explorer from "./Explorer/explorer";
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
      historyIndex: 0
    };

    this.onIClick = this.onIClick.bind(this);
    this.onDBClick = this.onDBClick.bind(this);
    this.listFolder = this.listFolder.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.refresh = this.refresh.bind(this);
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

  listFolder(path){
    fetch(REST_URL+'/API/SYSTEM/IO/PATH/listPath.php?path='+path)
    .then(response => response.json())
    .then(json => {
        const JSONdata=JSON.parse(json);
        this.setState({
          listDir: JSONdata.data,
        });
    });
  } 

  componentWillMount(){
    this.listFolder(this.state.currentPath);
  }

  onIClick(data) {
    this.setState({ selected: data.name });
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
          history: newHistory 
        });
      }, 10);
    } else {
      alert("Open File " + this.state.currentPath + data.name);
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
          refresh={this.refresh} 
        />
        <Explorer
          onIClick={this.onIClick}
          onDBClick={this.onDBClick}
          selected={this.state.selected}
          listDir={this.state.listDir}
        />
      </div>
    );
  }
}

export default FileManager;
