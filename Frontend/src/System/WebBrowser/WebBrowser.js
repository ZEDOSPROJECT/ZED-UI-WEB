import React from "react";
import Tab from "./Tab/Tab";
import NewTab from './NewTab/NewTab';
import getUUID from 'uuid';

import "./styles.css";
import BrowserContainer from "./BrowserContainer/BrowserContainer";

class WebBrowser extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      tabs: [{obj:<BrowserContainer key={getUUID()} />,title:"teste"}],
      currentTab: 0
    }

    this.switchTab = this.switchTab.bind(this);
    this.newTab = this.newTab.bind(this);
    this.closeTab = this.closeTab.bind(this);
  }

  switchTab(i){
    this.setState({
      currentTab: i
    })
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

  newTab(){
    let NewWB=<BrowserContainer key={getUUID()}/>;
    this.setState({
      tabs: this.state.tabs.concat({obj:NewWB,title:"teste"}),
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
        return <Tab closeTab={this.closeTab} selected={true} key={i} id={i} switchTab={this.switchTab} title={item.title} />
      }else{
        return <Tab closeTab={this.closeTab} selected={false} key={i} id={i} switchTab={this.switchTab} title={item.title} />
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
