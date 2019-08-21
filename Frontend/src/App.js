import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getUUID from 'uuid';
import startUpSound from './Sounds/startup.mp3';
import TaskBar from './System/Taskbar/taskbar';
import Window from './System/Window/window';
import StartMenu from './System/StartMenu/startMenu';
import DesktopIcons from './System/DesktopIcons/desktopIcons';
import BlueLightFilter from './System/BlueFilter/blueFilter';
import { REST_URL } from './REST_URL';
import './App.css';
import { setTimeout } from 'timers';


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        openedWindows:[],
        showMenu: false,
        setting_blueFilter: false,
        setting_wallpaperURL: '',
        setting_wallpaperColor: '#004e98',
        setting_resolution: '100%',
        userPaths: null,
        nextWindowX: 15,
        nextWindowY: 15,
        videoWallpaperURL: ""
    };
    window.systemColor0="#06001E";
    window.systemColor1="#06001E";
    window.maxZIndex=1;
    window.winTitle=[];
    window.ZED_RUN=null;
    window.autoGradient = false;
    window.gradientEffect = false;
    window.soundsEmitter=[];
    let startupSoundPlayer = new Audio(startUpSound);
    startupSoundPlayer.play();
    this.getGradient = this.getGradient.bind(this);
    this.createWindow = this.createWindow.bind(this);
    this.onClose = this.onClose.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.onClickApp = this.onClickApp.bind(this);
    this.onToggleMinimize = this.onToggleMinimize.bind(this);
    this.getBingPicture = this.getBingPicture.bind(this);
    this.loadUserSettings = this.loadUserSettings.bind(this);
    this.componentToHex = this.componentToHex.bind(this);
    this.rgbToHex = this.rgbToHex.bind(this);
    this.clean = this.clean.bind(this);
    setInterval(() => {
        this.loadUserSettings();
        this.clean();
        if(window.ZED_RUN !== null){
            const AppMetadata=Object.assign({}, window.ZED_RUN);
            this.onClickApp(null,AppMetadata.Url,AppMetadata.Label,AppMetadata.Icon);
            window.ZED_RUN=null;
        } 
    },2000);
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
    },50 );
  } 

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

  getGradient(){
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = (() => {
            var myCanvas = document.createElement('canvas');
            myCanvas.width = img.width;
            myCanvas.height = img.height;
            var ctx = myCanvas.getContext('2d');
            ctx.drawImage(img,0,0,img.width,img.height); // Or at whatever offset you like
            const colorTOP=myCanvas.getContext('2d').getImageData(img.width/2, 20, 1, 1).data;
            const colorBOTTOM=myCanvas.getContext('2d').getImageData(img.width/2,img.height-40, 1, 1).data;
            const finalColorTOP=this.rgbToHex(colorTOP[0],colorTOP[1],colorTOP[2]);
            const finalColorBOTTOM=this.rgbToHex(colorBOTTOM[0],colorBOTTOM[1],colorBOTTOM[2]); 
            if(window.autoGradient && window.setting_systemColor1 !== finalColorTOP && window.setting_systemColor0 !== finalColorBOTTOM){
                window.systemColor1 = finalColorTOP;
                window.systemColor0 = finalColorBOTTOM;
            } 
        });
        img.src = REST_URL+'/API/SYSTEM/SETTINGS/USER/SETTING/getCurrentBackground.php?file='+this.state.setting_wallpaperURL;
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
            setting_blueFilter: json.setting_blueFilter
        });
        this.setState({
            setting_resolution: json.setting_resolution
        });
        this.setState({
            videoWallpaperURL: json.videoWallpaperURL
        });
        if(!json.setting_autoGradientEffect){
            window.systemColor0=json.setting_systemColor0;
            window.systemColor1=json.setting_systemColor1;
        }else{
            if(window.gradientEffect){
                this.getGradient();
            } 
        }
        window.gradientEffect=json.setting_gradientEffect;
        window.autoGradient=json.setting_autoGradientEffect;
        if(window.setting_bingWallpaper !== json.setting_bingWallpaper){
            window.setting_bingWallpaper=json.setting_bingWallpaper;
            if(window.setting_bingWallpaper){
                this.getBingPicture();
            } 
        } 
        if(json.setting_wallpaperURL !== this.state.setting_wallpaperURL){
            this.setState({
                setting_wallpaperURL: json.setting_wallpaperURL
            });
        } 
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

  createWindow(url,title,icon,windowSize){
        const uuid = getUUID();
        var newList = this.state.openedWindows;
        newList.push({ 'UUID'  : uuid, 'WINDOW' : (
            <Window 
                userDirs={this.state.userPaths}  
                url={url}  
                icon={icon}
                windowSize={windowSize}
                nextWindowX={this.state.nextWindowX}
                nextWindowY={this.state.nextWindowY}
                uuid={uuid}   
                onClose={this.onClose}   
                onToggleMinimize={this.onToggleMinimize} 
            />
        ), 'VISIBLE' : true });
        window.winTitle[uuid]=title;
        let newX = this.state.nextWindowX;
        let newY = this.state.nextWindowY;
        const plusNewPosition=35;
        if(newX>150){
            newX=15;
        }else{
            newX+=plusNewPosition;
        }
        if(newY>150){
            newY=15;
        }else{
            newY+=plusNewPosition;
        }
        this.setState({
            openedWindows: newList,
            nextWindowX: newX,
            nextWindowY: newY    
        });
    }  

  onClickApp(e,url,name,icon,windowSize){
      if(!windowSize){
          windowSize={};
          windowSize['Width']=640;
          windowSize['Height']=480;
     }
      if( name !== "Web Browser" && name !== "MyComputer" && name !== "MyMusic" && name !== "MyPictures" && name !== "MyDocuments"){
        this.createWindow(url,name,icon,windowSize);
        this.setState({ showMenu: false });
      }else{
        if(name === "Web Browser"){
            this.createWindow("Web Browser","Web Browser",REST_URL+"/APPS/Web Browser/favicon.png",windowSize);
            this.setState({ showMenu: false });
        }
        if(name === "MyComputer"){
            window.explorer_open="/";
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png",windowSize);
            this.setState({ showMenu: false });
        }
        if(name === "MyMusic"){
            window.explorer_open=this.state.userPaths['music'];
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png",windowSize);
            this.setState({ showMenu: false });
        }
        if(name === "MyPictures"){
            window.explorer_open=this.state.userPaths['picture'];
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png",windowSize);
            this.setState({ showMenu: false });
        }
        if(name === "MyDocuments"){
            window.explorer_open=this.state.userPaths['documents'];
            this.createWindow(name,"ZED Explorer",REST_URL+"/API/SYSTEM/ICONS/ModernXP (35).png",windowSize);
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
        fetch(REST_URL+'/API//SYSTEM/SETTINGS/USER/SETTING/getOnlineWallpaper.php?url='+url);
    });
  } 

  render() {
    const windowList=this.state.openedWindows.map((item) => {
        if(item!=null){
            const visible=item.VISIBLE ? "winItem" : "winItem hidden";
            return(
                <div key={"winkey_"+item.UUID}  className={visible} >{item['WINDOW']}</div>
            );
        } else {
            return null;
        } 
    })
    const wallpaperURL = REST_URL+'/Wallpapers/Images/'+this.state.setting_wallpaperURL;
    const wallpaperColor = this.state.setting_wallpaperColor;
    return (
      <div className="App" style={{zoom: this.state.setting_resolution}} >
        { this.state.videoWallpaperURL !== "" ? (
            <video className="backgroundVideo" src={REST_URL+"/Wallpapers/Videos/"+this.state.videoWallpaperURL} loop autoPlay muted></video>
        ):(
            <div className="backgroundImage" style={ { backgroundImage: 'url('+ wallpaperURL + ')', backgroundColor: wallpaperColor }} >
            
            </div>
        )}
        <div className="windowArea">
            {windowList}
        </div>
        <DesktopIcons onClickApp={this.onClickApp}/>
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
        <BlueLightFilter enabled={this.state.setting_blueFilter}/>
      </div>
    );
  }
}

export default App;
