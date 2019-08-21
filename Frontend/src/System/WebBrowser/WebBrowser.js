import React from "react";
import Tab from "./Tab/Tab";
import NewTab from './NewTab/NewTab';
import getUUID from 'uuid';

import "./styles.css";
import BrowserContainer from "./BrowserContainer/BrowserContainer";

class WebBrowser extends React.Component {
  constructor(props){
    super(props);
    let startUUID=getUUID();
    let startTitles=[];
    let startIcons=[];

    this.switchTab = this.switchTab.bind(this);
    this.newTab = this.newTab.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.OnTitleChange = this.OnTitleChange.bind(this);
    this.onFavChange = this.onFavChange.bind(this);

    startTitles[startUUID]="Starting";
    startIcons[startUUID]=undefined;

    this.state = {
      tabs: [{obj:<BrowserContainer
                     newTab={this.newTab}
                     onFavChange={this.onFavChange}
                     OnTitleChange={this.OnTitleChange}
                     id={startUUID}
                     key={startUUID}
                  />}],
      titles: startTitles,
      icons: startIcons,
      currentTab: 0,
    }
  }

  switchTab(i){
    this.setState({
      currentTab: i
    })
  }
  
  onFavChange(uuid,newIcon){
    if(this.state !== undefined){
      let newIcones = this.state.icons;
      newIcones[uuid.toString()]=newIcon;
      this.setState({
        icons: newIcones
      });
    }
  }

  OnTitleChange(uuid,newTitle){
    if(this.state !== undefined){
      let newTitiles = this.state.titles;
      newTitiles[uuid.toString()]=newTitle;
      this.setState({
        titles: newTitiles
      });
    }
  }
  

  closeTab(i){
    let newData = this.state.tabs;
    delete newData[i];
    this.setState({ tabs: newData });
    setTimeout(() => {
      this.setState({
        currentTab: 0
      });
    }, 12);
  }

  newTab(url){
    let newUUID=getUUID();
    let NewWB=<BrowserContainer
                newTab={this.newTab}
                URL={url}
                onFavChange={this.onFavChange}
                OnTitleChange={this.OnTitleChange}
                id={newUUID}
                key={newUUID}
              />;
    let newTitiles=this.state.titles;
    newTitiles[newUUID.toString()]="New Tab";
    this.setState({
      tabs: this.state.tabs.concat({obj:NewWB}),
      titles: newTitiles
    });
    setTimeout(() => {
      this.setState({
        currentTab: this.state.tabs.length-1
      });
    }, 12);
  }

  render() { 
    let finalTabs=this.state.tabs.map((item, i) => {
      if(i===this.state.currentTab){
        return <Tab
                  closeTab={this.closeTab}
                  selected={true}
                  key={i}
                  id={i}
                  switchTab={this.switchTab}
                  favIcoURL={this.state.icons[item.obj.key]} 
                  title={this.state.titles[item.obj.key]} 
              />
      }else{
        return <Tab
                  closeTab={this.closeTab}
                  selected={false}
                  key={i}
                  id={i}
                  switchTab={this.switchTab}
                  favIcoURL={this.state.icons[item.obj.key]} 
                  title={this.state.titles[item.obj.key]}
                />
      }
    }) 

    let finalWB=this.state.tabs.map((item, i) => {
      if(i===this.state.currentTab){
        return <div className="WBContainer">{item.obj}</div>;
      }else{
        return <div className="WBContainer" style={{ visibility: "hidden"}}>{item.obj}</div>;
      }
    }) 

    return (
      <div className="WebBrowser dontMove">
        <div className="TabManager">
          {finalTabs}
          <NewTab newTab={this.newTab}/>
        </div>
        {finalWB}
      </div>
    );
  }
}

export default WebBrowser;
