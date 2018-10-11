import React, { Component } from 'react';
import TaskBar from './System/Taskbar/taskbar';
import Window from './System/Window/window';
import StartMenu from './System/StartMenu/startMenu';
import { REST_URL } from './REST_URL';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        openedWindows:[],
        maxZIndex: 1,
        showMenu: false,
        wallpaperURL: '',
        wallpaperColor: '#004e98',
        bingWallpaper: false
    };
    this.createWindow = this.createWindow.bind(this);
    this.uuidv4 = this.uuidv4.bind(this);
    this.sendToFront = this.sendToFront.bind(this);
    this.onClose = this.onClose.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.onClickApp = this.onClickApp.bind(this);
    this.onToggleMinimize = this.onToggleMinimize.bind(this);
    this.getBingPicture = this.getBingPicture.bind(this);
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

  onToggleMinimize(uuid){
    let newData = this.state.openedWindows;
    let i=0;
    newData.forEach(element => {
        if( element.UUID === uuid ){
            newData[i]  .VISIBLE=!element.VISIBLE
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
                onToggleMinimize={this.onToggleMinimize} 
            />
        ), 'VISIBLE' : true });

        this.setState({ openedWindows: newList });
        this.setState({ maxZIndex:  this.state.maxZIndex+1 });
    }  

  onClickApp(e,name){
      this.createWindow(REST_URL+"/APPS/"+name,name,REST_URL+"/APPS/"+name+"/favicon.png");
      this.setState({ showMenu: false });
  } 

  toggleMenu(){
      this.setState({
          showMenu: !this.state.showMenu,
      });
  }

  getBingPicture(){
    fetch('https://cors.io/?https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US')
    .then(response => response.json())
    .then(json => {
        let url="https://www.bing.com/"+json.images[0].url;
        this.setState({
            wallpaperURL: url
        });
    });
  } 

  render() {
    const windowList=this.state.openedWindows.map((item) => {
        const visible=item.VISIBLE ? "" : "hidden";
        return(
            <div style={{ visibility: visible }}  >{item['WINDOW']}</div>
        );
    })
    const wallpaperURL = this.state.wallpaperURL;
    const wallpaperColor = this.state.wallpaperColor;
    if(this.state.bingWallpaper){
        this.getBingPicture();
    } else {
        const settingWallpaperURL = require('./Wallpaper/wallpaper.jpg');
        
        if(settingWallpaperURL!=this.state.wallpaperURL){
            this.setState({
                wallpaperURL: settingWallpaperURL
            });
        } 
    } 
    return (
      <div className="App" style={ { backgroundImage: 'url(' + wallpaperURL + ')', backgroundColor: wallpaperColor  } } >
        <div className="windowArea">
            {windowList}
        </div>
        <TaskBar openedWindows={this.state.openedWindows} onToggleMinimize={this.onToggleMinimize} toggleMenu={this.toggleMenu}/>
        <StartMenu onClickApp={this.onClickApp} toggleMenu={this.toggleMenu} visible={this.state.showMenu}/>
      </div>
    );
  }
}

export default App;
