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
        setting_wallpaperURL: '',
        setting_wallpaperColor: '#004e98'
    };
    this.createWindow = this.createWindow.bind(this);
    this.uuidv4 = this.uuidv4.bind(this);
    this.sendToFront = this.sendToFront.bind(this);
    this.onClose = this.onClose.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.onClickApp = this.onClickApp.bind(this);
    this.onToggleMinimize = this.onToggleMinimize.bind(this);
    this.getBingPicture = this.getBingPicture.bind(this);
    this.loadUserSettings = this.loadUserSettings.bind(this);

    setInterval(() => {
        this.loadUserSettings();
    },1000);
  } 

  loadUserSettings(){
    fetch(REST_URL+'/API/SYSTEM/SETTINGS/USER/getSettings.php')
    .then(response => response.json())
    .then(json => {
        if(json.setting_wallpaperColor!=this.state.setting_wallpaperColor){
            this.setState({
                setting_wallpaperColor: json.setting_wallpaperColor
            });
        } 
        if(json.setting_bingWallpaper){
            this.getBingPicture();
        } else {
            if(json.setting_wallpaperURL!=this.state.setting_wallpaperURL){
                this.setState({
                    setting_wallpaperURL: json.setting_wallpaperURL
                });
            } 
        } 
    });
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
            setting_wallpaperURL: url
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
    const wallpaperURL = this.state.setting_wallpaperURL;
    const wallpaperColor = this.state.setting_wallpaperColor;
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
