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
      listDir:[] 
    };

    this.onIClick = this.onIClick.bind(this);
    this.onDBClick = this.onDBClick.bind(this);
    this.listFolder = this.listFolder.bind(this);
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
      setTimeout(() => {
        this.setState({ currentPath: newPath });
      }, 10);
    } else {
      alert("Open File " + this.state.currentPath + data.name);
    }
  }

  render() {
    return (
      <div className="fm">
        <ToolBar currentPath={this.state.currentPath} />
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
