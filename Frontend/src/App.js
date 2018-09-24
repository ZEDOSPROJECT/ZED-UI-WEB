import React, { Component } from 'react';
import TaskBar from './System/Taskbar/taskbar';
import Window from './System/Window/window';
import StartMenu from './System/StartMenu/startMenu';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        openedWindows:[],
        maxZIndex: 1,
        showMenu: false,
    };
    this.createWindow = this.createWindow.bind(this);
    this.uuidv4 = this.uuidv4.bind(this);
    this.sendToFront = this.sendToFront.bind(this);
    this.onClose = this.onClose.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  } 

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  sendToFront(i){
      if(i<=this.state.maxZIndex){
          return true;
      } else {
          this.setState({ maxZIndex:  i })
          return false;
      } 
  } 

  onClose(uuid){
      let newData = this.state.openedWindows;
      let i=0;
      newData.forEach(element => {
          if( element.UUID === uuid ){
              newData.splice(i, 1);
          } 
          i++;
      });
      this.setState({ openedWindows: newData });
  } 

  createWindow(url,title,icon){
      const uuid = this.uuidv4();
      var newList = this.state.openedWindows;
      newList.push({ 'UUID'  : uuid, 'WINDOW' : (
          <Window 
                  url={url}  
                  title={title}  
                  icon={icon}
                  uuid={uuid}   
                  onClose={this.onClose} 
                  sendToFront={this.sendToFront} 
                  maxZIndex={this.state.maxZIndex+1} 
          />
      )});
      this.setState({ openedWindows: newList });
      this.setState({ maxZIndex:  this.state.maxZIndex+1 });
  } 

  toggleMenu(){
      this.setState({
          showMenu: !this.state.showMenu,
      });
  }

  render() {
    const windowList=this.state.openedWindows.map((item) => {
        return(
            item['WINDOW']
        );
    })
    return (
      <div className="App">
        <div className="windowArea">
            {windowList}
        </div>
        <TaskBar toggleMenu={this.toggleMenu}/>
        <StartMenu toggleMenu={this.toggleMenu} visible={this.state.showMenu}/>
      </div>
    );
  }
}

export default App;
