import React, { Component } from 'react';
import Sound from 'react-sound';
import { ToastContainer, toast } from 'react-toastify';
import {Animated} from "react-animated-css";
import 'react-toastify/dist/ReactToastify.css';
import startUpSound from './Sounds/startup.mp3';
import TaskBar from './System/Taskbar/taskbar';
import Window from './System/Window/window';
import StartMenu from './System/StartMenu/startMenu';
import { REST_URL } from './REST_URL';
import './App.css';
import { setTimeout } from 'timers';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        openedWindows:[],
        showMenu: false,
        setting_wallpaperURL: '',
        setting_wallpaperColor: '#004e98',
        setting_resolution: '100%',
        sound: "PLAYING",
        userPaths: null
    };
    window.systemColor0="#06001E";
    window.systemColor1="#06001E";
    window.maxZIndex=1;
    window.winTitle=new Array();
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
    setTimeout(() => {
        console.info = data => toast.info(data);
        console.error = data => toast.error(data);
        console.warn = data => toast.warn(data);
        fetch(REST_URL+'/API/SYSTEM/SETTINGS/USER/getPaths.php')
        .then(response => response.json())
        .then(json => {
            this.setState({
                userPaths: json
            });
        });
    },1000 );
  } 


  clean(){
    let newData = this.state.openedWindows;
    let iWindows=0;
    newData.forEach(element => {
        if(element!=null){
            iWindows++;
        }
    });
    if(iWindows === 0){
        window.maxZIndex=1;
        newData = []; 
    } 
    this.setState({ openedWindows: newData });
  } 

  loadUserSettings(){
    fetch(REST_URL+'/API/SYSTEM/SETTINGS/USER/getSettings.php')
    .then(response => response.json())
    .then(json => {
        if(json.setting_wallpaperColor !== this.state.setting_wallpaperColor){
            this.setState({
                setting_wallpaperColor: json.setting_wallpaperColor
            });
        } 
        this.setState({
            setting_resolution: json.setting_resolution
        });
        window.systemColor0=json.setting_systemColor0;
        window.systemColor1=json.setting_systemColor1;
        window.gradientEffect=json.setting_gradientEffect;
        if(json.setting_bingWallpaper){
            this.getBingPicture();
        } else {
            if(json.setting_wallpaperURL !== this.state.setting_wallpaperURL){
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
      delete window.winTitle[uuid]; 
      this.setState({ openedWindows: newData });
  } 

  onToggleMinimize(uuid){
    let newData = this.state.openedWindows;
    let i=0;
    newData.forEach(element => {
        if(element!=null){
            if( element.UUID === uuid ){
                newData[i].VISIBLE=!element.VISIBLE
                if(newData[i].VISIBLE){
                    window.toFront=uuid;
                } 
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
                userDirs={this.state.userPaths}  
                url={url}  
                icon={icon}
                uuid={uuid}   
                onClose={this.onClose}   
                onToggleMinimize={this.onToggleMinimize} 
            />
        ), 'VISIBLE' : true });
        window.winTitle[uuid]=title;
        this.setState({ openedWindows: newList });
    }  

  onClickApp(e,name){
      if(name !== "MyComputer" && name !== "MyMusic" && name !== "MyPictures" && name !== "MyDocuments"){
        this.createWindow(REST_URL+"/APPS/"+name+"/",name,REST_URL+"/APPS/"+name+"/favicon.png");
        this.setState({ showMenu: false });
      }else{
        if(name === "MyComputer"){
            window.explorer_open="/";
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png");
            this.setState({ showMenu: false });
        }
        if(name === "MyMusic"){
            window.explorer_open=this.state.userPaths['music'];
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png");
            this.setState({ showMenu: false });
        }
        if(name === "MyPictures"){
            window.explorer_open=this.state.userPaths['picture'];
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png");
            this.setState({ showMenu: false });
        }
        if(name === "MyDocuments"){
            window.explorer_open=this.state.userPaths['documents'];
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png");
            this.setState({ showMenu: false });
        }
      } 
  } 

  toggleMenu(){
      this.setState({
          showMenu: !this.state.showMenu,
      });
      if(!this.state.showMenu){
        document.getElementById("searchBox").value="";
        document.getElementById("searchBox").focus();
      } 
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
        sound: "STOPPED"
    });
  }

  render() {
    const windowList=this.state.openedWindows.map((item) => {
        if(item!=null){
            const visible=item.VISIBLE ? "winItem" : "winItem hidden";
            return(
                <div className={visible} >{item['WINDOW']}</div>
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
            openedWindows={this.state.openedWindows}
            onToggleMinimize={this.onToggleMinimize}
            toggleMenu={this.toggleMenu}
        />
        <StartMenu
            onClickApp={this.onClickApp}
            toggleMenu={this.toggleMenu}
            visible={this.state.showMenu}
        />
        <ToastContainer />
      </div>
    );
  }
}

export default App;
