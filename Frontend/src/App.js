import React, { Component } from 'react';
import Sound from 'react-sound';
import startUpSound from './Sounds/startup.mp3';
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
        showMenu: false,
        setting_wallpaperURL: '',
        setting_wallpaperColor: '#004e98',
        setting_resolution: '100%',
        setting_systemColor: '#06001E',
        sound: "PLAYING"
    };
    window.maxZIndex=1;
    this.createWindow = this.createWindow.bind(this);
    this.uuidv4 = this.uuidv4.bind(this);
    this.onClose = this.onClose.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.onClickApp = this.onClickApp.bind(this);
    this.onToggleMinimize = this.onToggleMinimize.bind(this);
    this.getBingPicture = this.getBingPicture.bind(this);
    this.loadUserSettings = this.loadUserSettings.bind(this);
    this.clean = this.clean.bind(this);
    this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this);

    setInterval(() => {
        this.loadUserSettings();
        this.clean();
    },1000);
  } 

  clean(){
    let newData = this.state.openedWindows;
    let i=0;
    let iWindows=0;
    newData.forEach(element => {
        if(element!=null){
            iWindows++;
        }
        i++;
    });
    if(iWindows==0){
        window.maxZIndex=1;
        newData = []; 
    } 
    this.setState({ openedWindows: newData });
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
        this.setState({
            setting_resolution: json.setting_resolution
        });
        this.setState({
            setting_systemColor: json.setting_systemColor
        });
        if(json.setting_bingWallpaper){
            this.getBingPicture();
        } else {
            if(json.setting_wallpaperURL!=this.state.setting_wallpaperURL){
                this.setState({
                    setting_wallpaperURL: REST_URL+'/Wallpapers/'+json.setting_wallpaperURL
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

  onClose(uuid){
      let newData = this.state.openedWindows;
      let i=0;
      newData.forEach(element => {
          if(element!=null){
            if( element.UUID === uuid ){
                newData[i]=null;
            } 
          } 
          i++;
      });
      this.setState({ openedWindows: newData });
  } 

  onToggleMinimize(uuid){
    let newData = this.state.openedWindows;
    let i=0;
    newData.forEach(element => {
        if(element!=null){
            if( element.UUID === uuid ){
                newData[i].VISIBLE=!element.VISIBLE
            } 
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
                onToggleMinimize={this.onToggleMinimize} 
                systemColor={this.state.setting_systemColor} 
            />
        ), 'VISIBLE' : true });

        this.setState({ openedWindows: newList });
	window.maxZIndex=window.maxZIndex+1;
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

  handleSongFinishedPlaying(){
    this.setState({
        sound: "stop"
    });
  } 

  render() {
    const windowList=this.state.openedWindows.map((item) => {
        if(item!=null){
            const visible=item.VISIBLE ? "" : "hidden";
            return(
                <div style={{ visibility: visible }}  >{item['WINDOW']}</div>
            );
        } 
    })
    const wallpaperURL = this.state.setting_wallpaperURL;
    const wallpaperColor = this.state.setting_wallpaperColor;
    return (
      <div className="App" style={ { backgroundImage: 'url(' + wallpaperURL + ')', backgroundColor: wallpaperColor, zoom: this.state.setting_resolution  } } >
        <div className="windowArea">
            {windowList}
        </div>
        <Sound
            url={startUpSound}
            loop={false}
            playStatus={this.state.sound} 
            onFinishedPlaying={this.handleSongFinishedPlaying}
        />
        <TaskBar
            systemColor={this.state.setting_systemColor}
            openedWindows={this.state.openedWindows}
            onToggleMinimize={this.onToggleMinimize}
            toggleMenu={this.toggleMenu}
        />
        <StartMenu
            systemColor={this.state.setting_systemColor}
            onClickApp={this.onClickApp}
            toggleMenu={this.toggleMenu}
            visible={this.state.showMenu}
        />
      </div>
    );
  }
}

export default App;
