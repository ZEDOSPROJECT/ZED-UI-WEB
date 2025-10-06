import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as getUUID } from 'uuid';
import errorSound from './Sounds/error.mp3';
import warningSound from './Sounds/warning.mp3';
import infoSound from './Sounds/info.mp3';
import TaskBar from './System/Taskbar/taskbar';
import Window from './System/Window/window';
import StartMenu from './System/StartMenu/startMenu';
import DesktopIcons from './System/DesktopIcons/desktopIcons';
import BlueLightFilter from './System/BlueFilter/blueFilter';
import ScreenSaver from './System/ScreenSaver/ScreenSaver';
import UI3D from './System/UI3D/UI3D';
import ShutdownDLG from './System/SystemDialogs/Shutdown/Shutdown'
import FirstBOOT from './FIRSTBOOT.jpg';
import { REST_URL } from './REST_URL';
import './App.css';
import { setTimeout } from 'timers';


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openedWindows: [],
            showMenu: false,
            setting_blueFilter: false,
            setting_wallpaperURL: '',
            wallpaperBlob: undefined,
            setting_wallpaperColor: '#004e98',
            setting_resolution: '100%',
            userPaths: null,
            nextWindowX: 15,
            nextWindowY: 15,
            videoWallpaperURL: "",
            ScreenSaverTimer: 0,
            notSwitch3Dlbl: "3D",
            shutdownDLG: false,
            logout: false
        };
        window.clipBoard = "";
        window.systemColor0 = "#06001E";
        window.systemColor1 = "#06001E";
        window.maxZIndex = 1;
        window.winTitle = [];
        window.ZED_RUN = null;
        window.autoGradient = false;
        window.gradientEffect = false;
        window.soundsEmitter = [];
        this.getGradient = this.getGradient.bind(this);
        this.createWindow = this.createWindow.bind(this);
        this.onClose = this.onClose.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.onClickApp = this.onClickApp.bind(this);
        this.onToggleMinimize = this.onToggleMinimize.bind(this);
        this.loadUserSettings = this.loadUserSettings.bind(this);
        this.componentToHex = this.componentToHex.bind(this);
        this.rgbToHex = this.rgbToHex.bind(this);
        this.clean = this.clean.bind(this);
        this.processSysCalls = this.processSysCalls.bind(this);
        this.msgInfo = this.msgInfo.bind(this);
        this.msgError = this.msgError.bind(this);
        this.msgWarn = this.msgWarn.bind(this);
        this.onSwitch3DClick = this.onSwitch3DClick.bind(this);
        this.onShutdownDLGCancel = this.onShutdownDLGCancel.bind(this);
        this.onShutdownDLGShow = this.onShutdownDLGShow.bind(this);
        this.onLogoutCancel = this.onLogoutCancel.bind(this);
        this.onLogout = this.onLogout.bind(this);

        this.onMouseMove = this.onMouseMove.bind(this);

        setInterval(() => {
            this.clean();
            if (window.ZED_RUN !== null) {
                const AppMetadata = Object.assign({}, window.ZED_RUN);
                this.onClickApp(null, AppMetadata.Url, AppMetadata.Label, AppMetadata.Icon, undefined, AppMetadata.SystemWindow);
                window.ZED_RUN = null;
            }
            if (window.soundsEmitter.length > 0) {
                this.setState({ ScreenSaverTimer: 0 });
            }
        }, 1000);

        setInterval(() => {
            if(window.loadUserSettings==="X"){
                window.loadUserSettings=undefined;
                this.loadUserSettings();
            }else{
                for (var key in window.winTitle) {
                    if (window.winTitle[key] === "Control Panel" || window.winTitle[key].includes("- ZED Picture Viewer")) {
                        this.loadUserSettings();
                    }
                }
            }
        }, 1000);

        setTimeout(() => {
            fetch(REST_URL + '/API/SYSTEM/SETTINGS/USER/getPaths.php')
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        userPaths: json
                    });
                });
            this.loadUserSettings();
            setTimeout(() => {
                if (window.gradientEffect) {
                    this.getGradient();
                }
            }, 200);
        }, 150);
        setInterval(() => {
            this.setState({ ScreenSaverTimer: this.state.ScreenSaverTimer + 1 });
        }, 60000);
    }

    onLogoutCancel() {
        this.setState({
            logout: false
        });
    }

    onLogout() {
        fetch(REST_URL + '/API/SYSTEM/ACTIONS/runAsRoot.php?pwd=""&cmd="pkill -u $USER"');
        // this.setState({
        //     logout: true
        // });
    }

    onShutdownDLGCancel() {
        this.setState({
            shutdownDLG: false
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
      }

    onShutdownDLGShow() {
        this.setState({
            shutdownDLG: true,
            showMenu: false
        });
    }

    onSwitch3DClick(e) {
        if (this.state.notSwitch3Dlbl === "3D") {
            this.setState({
                notSwitch3Dlbl: "2D"
            })
        } else {
            this.setState({
                notSwitch3Dlbl: "3D"
            })
        }
    }

    processSysCalls(call) {
        let calls = call.split(":");
        if (calls[0] === "SYSCALL") {
            if (calls[1] === "INSTALL") {
                fetch(REST_URL + '/API/APPS/installApp.php?appName=' + calls[2])
                    .then(response => response.text())
                    .then(text => {
                        if (text === "done") {
                            this.msgInfo(calls[2] + " installed!");
                        } else {
                            this.msgError("Erro installing " + calls[2]);
                        }
                    });
            } else if (calls[1] === "UNINSTALL") {
                fetch(REST_URL + '/API/APPS/uninstallApp.php?appName=' + calls[2])
                    .then(response => response.text())
                    .then(text => {
                        if (text === "done") {
                            if (localStorage.favoriteIcons) {
                                let tmpFavorites = JSON.parse(localStorage.favoriteIcons).favorites;
                                let id = 0;
                                let tmpFinalFav = {};
                                tmpFavorites.forEach(element => {
                                    if (element.Name === calls[2]) {
                                        tmpFavorites.splice(id, 1);
                                        tmpFinalFav["favorites"] = tmpFavorites;
                                        localStorage.favoriteIcons = JSON.stringify(tmpFinalFav);
                                    }
                                    id++;
                                });
                            }
                            this.msgInfo(calls[2] + " removed!");
                        } else {
                            this.msgError("Erro uninstalling " + calls[2]);
                        }
                    });
            } else if (calls[1] === "RESETSCREENSAVER") {
                this.setState({ ScreenSaverTimer: 0 });
            }
        } else {
            this.msgError("Invalid SYSCALL");
        }
    }

    onMouseMove() {
        this.setState({ ScreenSaverTimer: 0 });
    }

    msgInfo(data) {
        if (!data.includes("SYSCALL")) {
            toast.info(data);
            let infoSoundPlayer = new Audio(infoSound);
            infoSoundPlayer.play()
        } else {
            this.processSysCalls(data);
        }
    }

    msgError(data) {
        if (!data.includes("SYSCALL")) {
            let errorSoundPlayer = new Audio(errorSound);
            errorSoundPlayer.play();
            toast.error(data);
        } else {
            this.processSysCalls(data);
        }
    }


    msgWarn(data) {
        if (!data.includes("SYSCALL")) {
            let warningSoundPlayer = new Audio(warningSound);
            warningSoundPlayer.play();
            toast.warn(data);
        } else {
            this.processSysCalls(data);
        }
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    getGradient() {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = (() => {
            var myCanvas = document.createElement('canvas');
            myCanvas.width = img.width;
            myCanvas.height = img.height;
            var ctx = myCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height); // Or at whatever offset you like
            const colorTOP = myCanvas.getContext('2d').getImageData(img.width / 2, 20, 1, 1).data;
            const colorBOTTOM = myCanvas.getContext('2d').getImageData(img.width / 2, img.height - 40, 1, 1).data;
            const finalColorTOP = this.rgbToHex(colorTOP[0], colorTOP[1], colorTOP[2]);
            const finalColorBOTTOM = this.rgbToHex(colorBOTTOM[0], colorBOTTOM[1], colorBOTTOM[2]);
            if (window.autoGradient && window.setting_systemColor1 !== finalColorTOP && window.setting_systemColor0 !== finalColorBOTTOM) {
                window.systemColor1 = finalColorTOP;
                window.systemColor0 = finalColorBOTTOM;
            }
        });
        img.src = this.state.wallpaperBlob;
    }

    clean() {
        let newData = this.state.openedWindows;
        let iWindows = 0;
        newData.forEach(element => {
            if (element != null) {
                iWindows++;
            }
        });
        if (iWindows === 0) {
            window.maxZIndex = 1;
            newData = [];
        }
        this.setState({ openedWindows: newData });
    }

    loadUserSettings() {
        fetch(REST_URL + '/API/SYSTEM/SETTINGS/USER/getSettings.php?smartdesk=0')
            .then(response => response.json())
            .then(json => {
                if (json.setting_wallpaperColor !== this.state.setting_wallpaperColor) {
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
                if (!json.setting_autoGradientEffect) {
                    window.systemColor0 = json.setting_systemColor0;
                    window.systemColor1 = json.setting_systemColor1;
                }
                window.gradientEffect = json.setting_gradientEffect;
                window.autoGradient = json.setting_autoGradientEffect;
                if(json.setting_wallpaperURL==="FIRSTBOOT"){
                    this.setState({
                        setting_wallpaperURL: json.setting_wallpaperURL,
                        wallpaperBlob: FirstBOOT
                    }); 
                }else{
                    if (json.setting_wallpaperURL !== this.state.setting_wallpaperURL) {
                        fetch(REST_URL + '/API/SYSTEM/IO/FILE/read.php?path=' + json.setting_wallpaperURL)
                        .then(response => response.blob())
                        .then(blob => {
                            this.setState({
                                setting_wallpaperURL: json.setting_wallpaperURL,
                                wallpaperBlob: URL.createObjectURL(blob)
                            }); 
                            if (json.setting_autoGradientEffect) {
                                setTimeout(() => {
                                    this.getGradient(); 
                                }, 20);
                            }
                        });
                    }
                }
            });
    }

    onClose(uuid) {
        setTimeout(() => {
            let id = -1;
            let x = 0
            window.soundsEmitter.forEach(element => {
                if (element === uuid)
                    id = x;
                x++;
            });
            if (id !== -1) {
                window.soundsEmitter.splice(id, 1);
            }
        }, 300);

        let newData = this.state.openedWindows;
        let i = 0;
        newData.forEach(element => {
            if (element != null) {
                if (element.UUID === uuid) {
                    newData[i] = null;
                }
            }
            i++;
        });
        delete window.winTitle[uuid];
        this.setState({ openedWindows: newData });
    }

    onToggleMinimize(uuid) {
        let newData = this.state.openedWindows;
        let i = 0;
        newData.forEach(element => {
            if (element != null) {
                if (element.UUID === uuid) {
                    if (window.topUUID !== uuid) {
                        window.topUUID = uuid;
                        window.toFront = uuid;
                        newData[i].VISIBLE = true;
                    } else {
                        newData[i].VISIBLE = !element.VISIBLE
                        if (newData[i].VISIBLE) {
                            window.toFront = uuid;
                        }
                    }
                }
            }
            i++;
        });
        this.setState({ openedWindows: newData });
    }

    createWindow(url, title, icon, windowSize, systemWindow) {
        const uuid = getUUID();
        var newList = this.state.openedWindows;
        newList.push({
            'UUID': uuid, 'WINDOW': (
                <Window
                    userDirs={this.state.userPaths}
                    url={url}
                    systemWindow={systemWindow}
                    icon={icon}
                    windowSize={windowSize}
                    onError={this.msgError}
                    onWarn={this.msgWarn}
                    onInfo={this.msgInfo}
                    nextWindowX={this.state.nextWindowX}
                    nextWindowY={this.state.nextWindowY}
                    uuid={uuid}
                    onClose={this.onClose}
                    onClickApp={this.onClickApp}
                    onToggleMinimize={this.onToggleMinimize}
                />
            ), 'VISIBLE': true
        });
        window.winTitle[uuid] = title;
        let newX = this.state.nextWindowX;
        let newY = this.state.nextWindowY;
        const plusNewPosition = 35;
        if (newX > 150) {
            newX = 15;
        } else {
            newX += plusNewPosition;
        }
        if (newY > 150) {
            newY = 15;
        } else {
            newY += plusNewPosition;
        }
        this.setState({
            openedWindows: newList,
            nextWindowX: newX,
            nextWindowY: newY
        });
    }

    onClickApp(e, url, name, icon, windowSize, systemWindow) {
        if (!windowSize) {
            windowSize = {};
            windowSize['Width'] = 0;
            windowSize['Height'] = 0;
        }
        if (url.includes("/Web Browser/")) {
            systemWindow = true;
        }
        if (!systemWindow) {
            this.createWindow(url, name, icon, windowSize, systemWindow);
            this.setState({ showMenu: false });
        } else {
            if (name === "Web Browser") {
                this.createWindow("Web Browser", "Web Browser", REST_URL + "/APPS/Web Browser/favicon.png", windowSize, systemWindow);
                this.setState({ showMenu: false });
            }
            if (name === "MyComputer") {
                window.explorer_open = "My Computer";
                this.createWindow(name, "ZED Explorer", REST_URL + "/API/SYSTEM/ICONS/ModernXP (35).png", windowSize, systemWindow);
                this.setState({ showMenu: false });
            }
            if (name === "MyMusic") {
                window.explorer_open = this.state.userPaths['music'];
                this.createWindow(name, "ZED Explorer", REST_URL + "/API/SYSTEM/ICONS/ModernXP (35).png", windowSize, systemWindow);
                this.setState({ showMenu: false });
            }
            if (name === "MyPictures") {
                window.explorer_open = this.state.userPaths['picture'];
                this.createWindow(name, "ZED Explorer", REST_URL + "/API/SYSTEM/ICONS/ModernXP (35).png", windowSize, systemWindow);
                this.setState({ showMenu: false });
            }
            if (name === "MyDocuments") {
                window.explorer_open = this.state.userPaths['documents'];
                this.createWindow(name, "ZED Explorer", REST_URL + "/API/SYSTEM/ICONS/ModernXP (35).png", windowSize, systemWindow);
                this.setState({ showMenu: false });
            }
            if (name === "Copy") {
                windowSize['Width'] = 400;
                windowSize['Height'] = 185;
                this.createWindow(url, "Copy", REST_URL + "/API/SYSTEM/ICONS/copy.png", windowSize, systemWindow);
                this.setState({ showMenu: false });
            }
            if (name === "Save File") {
                windowSize['Width'] = 600;
                windowSize['Height'] = 485;
                this.createWindow(url, "Save File    ", REST_URL + "/API/SYSTEM/ICONS/ModernXP (35).png", windowSize, systemWindow);
                this.setState({ showMenu: false });
            }
        }
    }

    toggleMenu() {
        this.setState({
            showMenu: !this.state.showMenu,
        });
        if (!this.state.showMenu) {
            document.getElementById("searchBox").value = "";
            document.getElementById("searchBox").focus();
        }
    }

    render() {
        let username = "";
        if (this.state.userPaths !== null) {
            username = this.state.userPaths["username"]
            username = username.charAt(0).toUpperCase() + username.slice(1)
        }
        const windowList = this.state.openedWindows.map((item) => {
            if (item != null) {
                const visible = item.VISIBLE ? "winItem" : "winItem hidden";
                return (
                    <div key={"winkey_" + item.UUID} className={visible} >{item['WINDOW']}</div>
                );
            } else {
                return null;
            }
        })
        const wallpaperColor = this.state.setting_wallpaperColor;
        return (
            <div onMouseMove={this.onMouseMove} className="App" style={{ zoom: this.state.setting_resolution }} >
                {this.state.videoWallpaperURL !== "" ? (
                    <video className="backgroundVideo" src={REST_URL + "/Wallpapers/Videos/" + this.state.videoWallpaperURL} loop autoPlay muted></video>
                ) : (
                        <div className="backgroundImage" style={{ backgroundImage: 'url(' + this.state.wallpaperBlob + ')', backgroundColor: wallpaperColor }} >

                        </div>
                    )}
                <div className="windowArea">
                    {windowList}
                </div>
                <DesktopIcons onClickApp={this.onClickApp} />
                {this.state.notSwitch3Dlbl !== "3D" ? (
                    <UI3D onClickApp={this.onClickApp} />
                ) : null}
                <TaskBar
                    openedWindows={this.state.openedWindows}
                    onToggleMinimize={this.onToggleMinimize}
                    toggleMenu={this.toggleMenu}
                    onSwitch3DClick={this.onSwitch3DClick}
                    notSwitch3Dlbl={this.state.notSwitch3Dlbl}
                    onClose={this.onClose}
                    loadUserSettings={this.loadUserSettings}
                />
                <StartMenu
                    onClickApp={this.onClickApp}
                    toggleMenu={this.toggleMenu}
                    visible={this.state.showMenu}
                    userName={username}
                    onShutdownDLGShow={this.onShutdownDLGShow}
                    onLogout={this.onLogout}
                />
                {/* {this.state.logout ? (
                    <RunAsRoot
                        command="pkill -u $USER"
                        onCancel={this.onLogoutCancel}
                        onOk={this.onLogoutCancel}
                    />
                ) : null} */}

                <ToastContainer limit={3} draggablePercent={60} />
                <ShutdownDLG
                    visible={this.state.shutdownDLG}
                    onCancel={this.onShutdownDLGCancel}
                />
                <ScreenSaver timer={this.state.ScreenSaverTimer} />
                <BlueLightFilter enabled={this.state.setting_blueFilter} />
            </div>
        );
    }
}

export default App;
