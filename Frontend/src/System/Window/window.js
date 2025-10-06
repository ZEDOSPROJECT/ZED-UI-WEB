import React from 'react';
import invert from 'invert-color';
import * as htmlToImage from 'html-to-image';
import onClickOutside from 'react-onclickoutside';
import { Rnd } from "react-rnd";
import CCLOSE from './CLOSE.png';
import CMAXIMIZE from './MAXIMIZE.png';
import CRESTORE from './RESTORE.png';
import CMINIMIZE from './MINIMIZE.png';
import FileManager from '../FileManager/fileManager';
import WebBrowser from '../WebBrowser/WebBrowser';
import CopyDialog from '../SystemDialogs/Copy/copy.js';
import SaveDialog from '../SystemDialogs/Save/save.js';
import unknowApp from '../../Icons/ModernXP (69).png';
import VUGif from '../Taskbar/Task/vu.gif';
import { REST_URL } from '../../REST_URL';
import preload from './preload';
import './window.css';

class Window extends React.PureComponent {
    constructor(props) {
        super(props);

        let windowSize = this.props.windowSize;
        let positionX = this.props.nextWindowX;
        let positionY = this.props.nextWindowY;

        let appID = this.props.url.split("/");
        if (appID[4] === undefined) {
            appID = this.props.url;
        } else {
            appID = appID[4];
        }

        // If WindowSize in width and Height is equal ZERO has no manifest file
        if (windowSize.Width === 0 && windowSize.Height === 0) {
            if (localStorage["WINDOW_" + appID + "_X"]) {
                positionX = localStorage["WINDOW_" + appID + "_X"];
                positionY = localStorage["WINDOW_" + appID + "_Y"];
                windowSize.Width = localStorage["WINDOW_" + appID + "_W"];
                windowSize.Height = localStorage["WINDOW_" + appID + "_H"];
            } else {
                windowSize.Width = 640;
                windowSize.Height = 480;
            }
        }

        this.state = {
            WindowFreez: false,
            url: this.props.url,
            name: this.props.title || "Window",
            modalIsOpen: true,
            draggable: false,
            uuid: this.props.uuid,
            systemWindow: this.props.systemWindow,
            currentZIndex: window.maxZIndex,
            maximized: false,
            x: positionX,
            y: positionY,
            notResiable: false,
            width: windowSize.Width,
            height: windowSize.Height,
            active: true,
            systemColor0: window.systemColor0,
            systemColor1: window.systemColor1,
            gradient: 'on',
            myStyle: "window hidden",
            errorHiddenList: [
                "a parser-blocking cross site",
                "uncaught typeerror: cannot read property",
                "%",
                "refused to get unsafe header",
                "ad start",
                "failed to set referrer policy",
                "[object object]",
                "deprecationwarning",
                "refused to load the script"
            ],
            fullScreen: false
        };
        this.windowRef = React.createRef();
        setTimeout(() => {
            if (window.winTitle[this.state.uuid] && typeof window.winTitle[this.state.uuid] === 'string' && window.winTitle[this.state.uuid].includes("Copy")) {
                this.setState({ notResiable: true });
            }
            this.setState({ myStyle: "window shadow" });
        }, 40);

        this.convertHex = this.convertHex.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.sendToFront = this.sendToFront.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onToggleWindow = this.onToggleWindow.bind(this);
        this.onToggleMinimize = this.onToggleMinimize.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onErrorFRAME = this.onErrorFRAME.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleClickInsideWindow = this.handleClickInsideWindow.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.returnToApp = this.returnToApp.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);

        window.maxZIndex = window.maxZIndex + 1;
        window.topUUID = this.state.uuid;
        setInterval(() => {
            if(this.windowRef){
                if(this.props.systemWindow){
                    htmlToImage.toJpeg(this.windowRef.current)
                    .then((dataUrl)=> {
                        if(dataUrl!=="data:," && dataUrl!==""){
                            sessionStorage["w_WINDOW_"+this.state.uuid]=dataUrl;
                        }
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
                }else{
                    // Use webview capture (Electron-based)
                    if(this.webview){
                        this.webview.capturePage().then((value)=> {
                            let temp=value.toDataURL(0.1);
                            if(temp!=="data:image/png;base64," && temp!==""){
                                sessionStorage["w_WINDOW_"+this.state.uuid]=temp;
                            }
                        });
                    }
                }
            }
            if (window.toFront) {
                if (window.toFront === this.props.uuid) {
                    let newIndex = this.state.currentZIndex;
                    while (newIndex <= window.maxZIndex) {
                        newIndex++;
                    }
                    window.maxZIndex = newIndex + 1;
                    window.topUUID = this.state.uuid;
                    this.setState({ currentZIndex: newIndex + 1 });
                    window.toFront = undefined;
                }
            }
            if (this.state.systemColor0 !== window.systemColor0) {  
                this.setState({ systemColor0: window.systemColor0 });
            }
            if (this.state.gradient !== window.gradientEffect) {
                this.setState({ gradient: window.gradientEffect });
            }
            if (window.gradientEffect) {
                if (this.state.systemColor1 !== window.systemColor1) {
                    this.setState({ systemColor1: window.systemColor1 });
                }
            }
            this.forceUpdate();
        }, 800);
    }

    toggleFullScreen() {
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }

    returnToApp() {
        this.setState({
            url: this.props.url
        })
    }

    convertHex(hex, opacity) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps !== this.props || nextState !== this.state) {
            return true;
        }
    }

    handleClickOutside() {
        this.setState({ active: false });
    }

    handleClickInsideWindow() {
        this.setState({ active: true });
    }

    sendToFront() {
        setTimeout(() => {
            this.handleClickInsideWindow();
        }, 10);
        let newIndex = this.state.currentZIndex;
        while (newIndex < window.maxZIndex) {
            newIndex++;
        }
        window.maxZIndex = newIndex + 1;
        window.topUUID = this.state.uuid;
        this.setState({ currentZIndex: newIndex + 1 });
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }
    onClose() {
        setTimeout(() => {
            this.props.onClose(this.state.uuid);
        }, 240);
        this.setState({ myStyle: "window hidden" });

        let appID = this.state.url.split("/");
        if (appID[4] === undefined) {
            appID = this.state.url;
        } else {
            appID = appID[4];
        }
        localStorage["WINDOW_" + appID + "_X"] = this.state.x;
        localStorage["WINDOW_" + appID + "_Y"] = this.state.y;
        localStorage["WINDOW_" + appID + "_W"] = this.state.width;
        localStorage["WINDOW_" + appID + "_H"] = this.state.height;
    }

    onDragStart() {
        if(!this.state.WindowFreez){
            this.sendToFront();
            this.setState({
                WindowFreez:true
            })
        }
    }

    onDragStop() {
        this.setState({
            WindowFreez:true
        })
    }

    onDrag(e) {
    }

    onResizeStart() {
        if(!this.state.WindowFreez){
            this.sendToFront();
            this.setState({
                WindowFreez:true
            })
        }
    }

    onResizeStop(e) {
        this.setState({
            WindowFreez:true
        })
        setTimeout(() => {
            if (e.x > window.innerWidth) {
                this.setState({ x: 0 });
            }
            if (e.y > window.innerWidth) {
                this.setState({ y: 0 });
            }
        }, 40);
    }

    onToggleWindow() {
        let tmpStyle = "window";
        if (this.state.maximized) {
            tmpStyle = "window shadow";
        }
        this.setState({
            maximized: !this.state.maximized,
            myStyle: tmpStyle
        });
    }

    onToggleMinimize() {
        this.props.onToggleMinimize(this.state.uuid);
    }

    onErrorFRAME() {
        this.setState({ url: REST_URL + '/API/APPS/onErrorLoad.html' });
    }

    onTitleChange(newTitle) {
        window.winTitle[this.state.uuid] = newTitle;
        this.forceUpdate();
    }

    componentDidMount() {
        if (this.webview) {
            this.webview.addEventListener('media-started-playing', () => {
                let found = false;
                window.soundsEmitter.forEach(element => {
                    if (element === this.state.uuid)
                        found = true;
                });
                if (!found)
                    window.soundsEmitter.push(this.state.uuid);
            });
            this.webview.addEventListener('page-title-updated', (e) => {
                this.onTitleChange(e.title);
                this.forceUpdate();
            });

            this.webview.addEventListener('new-window', (e) => {
                this.props.onClickApp(null, e.url, "", unknowApp, 0, 0);
            });

            this.webview.addEventListener('enter-html-full-screen', (e) => {
                this.setState({ fullScreen: true });
            });

            this.webview.addEventListener('leave-html-full-screen', (e) => {
                this.setState({ fullScreen: false });
            });

            this.webview.addEventListener('close', (e) => {
                this.onClose();
            });

            this.webview.addEventListener('console-message', (e) => {
                const tmpWord = e.message.toLowerCase();
                let found = false;
                // Find consoole message to be hidden
                this.state.errorHiddenList.forEach(element => {

                    if (tmpWord.indexOf(element) !== -1) {
                        found = true;
                    }
                });
                ///////////////////////////////////

                // If not found get type of message and run onTYPE function
                if (!found) {
                    if (e.message !== "") {
                        if (e.level === 0) {
                            this.props.onInfo(e.message);
                        }
                        if (e.level === 1) {
                            this.props.onWarn(e.message);
                        }
                        if (e.level === 2) {
                            this.props.onError(e.message);
                        }
                        if (!e.message.includes("SYSCALL")) {
                            let tmpNotifications;
                            if (sessionStorage.Notifications === undefined) {
                                tmpNotifications = [];
                            } else {
                                tmpNotifications = JSON.parse(sessionStorage.Notifications);
                            }
                            tmpNotifications.push({
                                Type: e.level,
                                AppName: window.winTitle[this.state.uuid],
                                AppIcon: this.props.icon,
                                Message: e.message
                            })
                            sessionStorage.Notifications = JSON.stringify(tmpNotifications);
                        }
                    }
                }
                /////////////////
            });

            this.webview.addEventListener('media-paused', () => {
                let id = -1;
                let i = 0
                window.soundsEmitter.forEach(element => {
                    if (element === this.state.uuid)
                        id = i;
                    i++;
                });
                if (id !== -1) {
                    window.soundsEmitter.splice(id, 1);
                }
            });

            this.webview.addEventListener('crashed', (e) => {
                this.setState({ url: REST_URL + '/API/APPS/onErrorLoad.html' });
                this.forceUpdate();
            });
        }
    }

    render() {
        let WindowContent;
        let finalStyle = {};
        let finalBodyStyle = "body";
        let screenX = window.innerWidth;
        let screenY = window.innerHeight;
        let isPlaying = false;
        let systemWindow = this.state.systemWindow;
        if (window.soundsEmitter.indexOf(this.props.uuid) !== -1) {
            isPlaying = true;
        }
        if (!systemWindow) {
            // Use webview for all cases (Electron-based approach)
            WindowContent = (<webview
                                preload={preload}
                                ref={(input) => { this.webview = input; }}
                                onLoad={() => {
                                    // Initialize with app name, webview title will be updated via event listener
                                    this.onTitleChange(this.state.name);
                                }}
                                useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
                                className="frame dontMove"
                                onError={this.onErrorFRAME}
                                src={this.state.url}
                                plugins="true"
                                allowpopups="true">
                            </webview>);
        } else {
            const url = this.state.url;
            const params = url.split("|");
            let isOpen = false;
            if (url === "MyComputer" || this.state.url === "MyMusic" || this.state.url === "MyPictures" || this.state.url === "MyDocuments" || url === "Web Browser") {
                WindowContent = <FileManager onTitleChange={this.onTitleChange} userDirs={this.props.userDirs} className="frame dontMove" />
                isOpen = true;
            }
            if (url === "Web Browser") {
                WindowContent = <WebBrowser onTitleChange={this.onTitleChange} className="frame dontMove" />
                isOpen = true;
            }
            if (url === "Save File") {
                WindowContent = <SaveDialog userDirs={this.props.userDirs} onTitleChange={this.onTitleChange} className="frame dontMove" />
                isOpen = true;
            }
            if (params[0] === "copy") {
                if (params[1] !== "" && params[2] !== "") {
                    WindowContent = <CopyDialog UUID={this.state.uuid} onClose={this.onClose} from={params[1]} to={params[2]} onTitleChange={this.onTitleChange} className="frame dontMove" />
                    isOpen = true;
                }
            }
            if (!isOpen) {
                setTimeout(() => {
                    this.onClose();
                }, 40);
            }
        }

        if (this.state.maximized) {
            finalBodyStyle = "body maximizedBody";
        }
        if (!window.gradientEffect) {
            finalStyle = { backgroundColor: this.convertHex(this.state.systemColor0, 50) };
        } else {
            finalStyle = { background: 'linear-gradient(' + this.convertHex(this.state.systemColor1, 65) + ', ' + this.convertHex(this.state.systemColor0, 65) }
        }

        return (
                <div>
                    <Rnd
                        default={{
                            x: 15,
                            y: 15,
                            width: 640,
                            height: 480
                        }}
                        minWidth="200"
                        minHeight="200"
                        cancel=".dontMove"
                        disableDragging={this.state.maximized}
                        style={{ zIndex: this.state.currentZIndex }}
                        size={{ width: (this.state.maximized ? '100%' : this.state.width), height: (this.state.maximized ? '100%' : this.state.height) }}
                        position={{ x: (this.state.maximized ? '0' : this.state.x), y: (this.state.maximized ? '0' : this.state.y) }}
                        onDragStart={this.onDragStart}
                        onResizeStart={this.onResizeStart}
                        onResizeStop={this.onResizeStop}
                        onDrag={this.onDrag}
                        onDragStop={(e, d) => {
                            if (e.y === 0) {
                                setTimeout(() => {
                                    this.setState({ maximized: true });
                                }, 20);
                            }
                            if (e.x < 10) {
                                setTimeout(() => {
                                    this.setState({ x: 0, y: 0, width: "50%", height: "99.5%" });
                                }, 20);
                            }
                            if (e.x > screenX - 10) {
                                setTimeout(() => {
                                    this.setState({ x: screenX / 2, y: 0, width: "50%", height: "99.5%" });
                                }, 20);
                            }
                            if (e.y > screenY - 45) {
                                setTimeout(() => {
                                    this.setState({ y: (screenY - 49) });
                                }, 20);
                            }
                            if (!this.state.maximized) {
                                this.setState({
                                    x: d.x, y: d.y
                                });
                            }
                        }}
                        onResize={(e, direction, ref, delta, position) => {
                            if (e.y < 0) {
                                this.setState({ y: 1 });
                            }
                            if (!this.state.maximized) {
                                this.setState({
                                    width: ref.offsetWidth,
                                    height: ref.offsetHeight,
                                    ...position,
                                });
                            }
                        }}
                    >
                        <div className={this.state.myStyle} initwidth={800} initheight={400} style={finalStyle}>
                            {isPlaying ? (<img draggable="false" alt="" className="bgUv" src={VUGif} />) : null}
                            <div onClick={this.sendToFront} onDoubleClick={this.onToggleWindow} className="titleBar" >
                                <div style={{ maxHeight: 20, width: 20 }} className="appIcon"><img draggable="false" alt="" className="appIcon" src={this.props.icon}></img></div>
                                <div className="appTitle" style={{ color: invert(window.systemColor1, true) }}>{window.winTitle[this.state.uuid] || "Window"}</div>
                                <div style={{ width: 150 }} className="appControls">
                                    <img draggable="false" alt="" className="btnXControl dontMove" onClick={this.onClose} src={CCLOSE} ></img>
                                    <img draggable="false" alt="" className="btnControl dontMove" onClick={this.onToggleWindow} src={(this.state.maximized ? CRESTORE : CMAXIMIZE)}></img>
                                    <img draggable="false" alt="" className="btnControl dontMove" onClick={this.onToggleMinimize} src={CMINIMIZE}></img>
                                </div>
                            </div>
                            <div ref={this.windowRef} onMouseDown={(e) => {e.stopPropagation()}} className={finalBodyStyle}>
                                {WindowContent}
                                {this.state.active ?
                                    null
                                    : (
                                        <div onClick={this.sendToFront} className="overlay"></div>
                                    )}
                            </div>
                        </div>
                    </Rnd>
                </div>
        );
    }
}


export default onClickOutside(Window);
